'use client';
import { useCallback, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Loading from '@/app/loading';
import * as z from 'zod';
import type { Database } from '@/lib/database.types';
import useStore from '@/store';
import { currencies } from '@/constants/currencies';
import { getExchangeRate } from '../dashboard/Transaction';
import type { TransactionType } from '@/types/transaction'; // Import TransactionType

type Schema = z.infer<typeof schema>;

// Define validation rules for input data
const schema = z.object({
  name: z.string().min(2, { message: 'Must be at least 2 characters.' }),
  introduce: z.string().min(0),
  primary_currency: z.string().min(3, { message: 'Please select a primary currency.' }), // Added
});

// Profile
const Profile = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [fileMessage, setFileMessage] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/default.png');
  const { user, fetchTransactions, setTransactions, setUser, fetchUserProfile } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    // Initial values
    defaultValues: {
      name: user.name ? user.name : '',
      introduce: user.introduce ? user.introduce : '',
      primary_currency: user.primary_currency ? user.primary_currency : 'USD', // Added primary_currency to initial values
    },
    // Input validation
    resolver: zodResolver(schema),
  });

  // Get avatar image
  useEffect(() => {
    if (user && user.avatar_url) {
      setAvatarUrl(user.avatar_url);
    }
  }, [user]);

  // Monitor login status and fetch profile
  useEffect(() => {
    if (user.id) {
      fetchUserProfile(user.id);
    }
  }, [user.id, fetchUserProfile]);

  // Upload image
  const onUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileMessage('');

    // If no file is selected
    if (!files || files?.length == 0) {
      setFileMessage('Please upload an image.');
      return;
    }

    const fileSize = files[0]?.size / 1024 / 1024; // size in MB
    const fileType = files[0]?.type; // MIME type of the file

    // If image size exceeds 2MB
    if (fileSize > 2) {
      setFileMessage('Image size must be less than 2MB.');
      return;
    }

    // If file format is not jpg or png
    if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
      setFileMessage('Image must be in jpg or png format.');
      return;
    }

    // Set image
    setAvatar(files[0]);
  }, []);

  // Submit
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      let avatar_url = user.avatar_url;
      const oldPrimaryCurrency = user.primary_currency; // Previous primary currency

      if (avatar) {
        // Upload image to supabase storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from('profile')
          .upload(`${user.id}/${uuidv4()}`, avatar);
          console.log("data", storageData)

        // Error check
        if (storageError) {
          setMessage('An error occurred: ' + storageError.message);
          return;
        }

        if (avatar_url) {
          const fileName = avatar_url.split('/').slice(-1)[0];

          // Delete old image
          await supabase.storage.from('profile').remove([`${user.id}/${fileName}`]);
        }

        // Get image URL
        const { data: urlData } = await supabase.storage
          .from('profile')
          .getPublicUrl(storageData.path);

        avatar_url = urlData.publicUrl;
      }

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          introduce: data.introduce,
          avatar_url,
          primary_currency: data.primary_currency, // Added
        })
        .eq('id', user.id);

      // Error check
      if (updateError) {
        setMessage('An error occurred: ' + updateError.message);
        return;
      }

      // If primary currency has changed, perform transaction conversion
      if (data.primary_currency !== oldPrimaryCurrency) {
        const { data: transactions, error: fetchError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id);

        if (fetchError) {
          console.error('Error fetching transactions:', fetchError);
        } else {
          const updatedTransactions = await Promise.all(
            (transactions as TransactionType[]).map(async (transaction) => {
              const formattedDate = transaction.date.split('T')[0];
              const exchangeRate = await getExchangeRate(
                transaction.currency,
                data.primary_currency,
                formattedDate
              );
              const convertedAmount = transaction.amount * exchangeRate;
              return {
                ...transaction,
                converted_amount: convertedAmount, // Do not change the currency
              };
            })
          );

          // Update transactions
          const { error: updateTransactionsError } = await supabase
            .from('transactions')
            .upsert(updatedTransactions);

          if (updateTransactionsError) {
            console.error('Error updating transactions:', updateTransactionsError);
          }

          // Update Zustand store
          setTransactions(updatedTransactions);
        }
      }

      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessage('An error occurred: ' + error);
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="text-center font-bold text-xl mb-10">Profile</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar image */}
        <div className="mb-5">
          <div className="flex flex-col text-sm items-center justify-center mb-5">
            <div className="relative w-24 h-24 mb-5">
              <Image src={avatarUrl} className="rounded-full object-cover" alt="avatar" fill />
            </div>
            <input type="file" id="avatar" onChange={onUploadImage} />
            {fileMessage && <div className="text-center text-red-500 my-5">{fileMessage}</div>}
          </div>
        </div>

        {/* Name */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">Name</div>
          <input
            type="text"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="Name"
            id="name"
            {...register('name', { required: true })}
            required
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.name?.message}</div>
        </div>

        {/* Introduction */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">Introduction</div>
          <textarea
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="Introduction"
            id="introduce"
            {...register('introduce')}
            rows={5}
          />
        </div>

        {/* Primary currency selection */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">Primary Currency</div>
          <select
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            {...register('primary_currency', { required: true })}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <div className="my-3 text-center text-sm text-red-500">{errors.primary_currency?.message}</div>
        </div>

        {/* Change button */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-buttonPrimary hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              Change
            </button>
          )}
        </div>
      </form>

      {/* Message */}
      {message && <div className="my-5 text-center text-red-500 mb-5">{message}</div>}
    </div>
  );
}

export default Profile;

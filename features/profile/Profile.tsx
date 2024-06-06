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
import type { TransactionType } from '@/types/transaction'; // TransactionTypeをインポート

type Schema = z.infer<typeof schema>;

// 入力データの検証ルールを定義
const schema = z.object({
  name: z.string().min(2, { message: '2文字以上入力する必要があります。' }),
  introduce: z.string().min(0),
  primary_currency: z.string().min(3, { message: '主な通貨を選択してください。' }), // 追加
});

// プロフィール
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
    // 初期値
    defaultValues: {
      name: user.name ? user.name : '',
      introduce: user.introduce ? user.introduce : '',
      primary_currency: user.primary_currency ? user.primary_currency : 'USD', // 初期値にprimary_currencyを追加
    },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // アバター画像の取得
  useEffect(() => {
    if (user && user.avatar_url) {
      setAvatarUrl(user.avatar_url);
    }
  }, [user]);

  // ログイン状態を監視し、プロファイルをフェッチ
  useEffect(() => {
    if (user.id) {
      fetchUserProfile(user.id);
    }
  }, [user.id, fetchUserProfile]);

  // 画像アップロード
  const onUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileMessage('');

    // ファイルが選択されていない場合
    if (!files || files?.length == 0) {
      setFileMessage('画像をアップロードしてください。');
      return;
    }

    const fileSize = files[0]?.size / 1024 / 1024; // size in MB
    const fileType = files[0]?.type; // MIME type of the file

    // 画像サイズが2MBを超える場合
    if (fileSize > 2) {
      setFileMessage('画像サイズを2MB以下にする必要があります。');
      return;
    }

    // ファイル形式がjpgまたはpngでない場合
    if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
      setFileMessage('画像はjpgまたはpng形式である必要があります。');
      return;
    }

    // 画像をセット
    setAvatar(files[0]);
  }, []);

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      let avatar_url = user.avatar_url;
      const oldPrimaryCurrency = user.primary_currency; // 以前の主な通貨

      if (avatar) {
        // supabaseストレージに画像アップロード
        const { data: storageData, error: storageError } = await supabase.storage
          .from('profile')
          .upload(`${user.id}/${uuidv4()}`, avatar);

        // エラーチェック
        if (storageError) {
          setMessage('エラーが発生しました。' + storageError.message);
          return;
        }

        if (avatar_url) {
          const fileName = avatar_url.split('/').slice(-1)[0];

          // 古い画像を削除
          await supabase.storage.from('profile').remove([`${user.id}/${fileName}`]);
        }

        // 画像のURLを取得
        const { data: urlData } = await supabase.storage
          .from('profile')
          .getPublicUrl(storageData.path);

        avatar_url = urlData.publicUrl;
      }

      // プロフィールアップデート
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          introduce: data.introduce,
          avatar_url,
          primary_currency: data.primary_currency, // 追加
        })
        .eq('id', user.id);

      // エラーチェック
      if (updateError) {
        setMessage('エラーが発生しました。' + updateError.message);
        return;
      }

      // 主な通貨が変更された場合、トランザクションの変換を実行
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
                converted_amount: convertedAmount, // 通貨は変更しない
              };
            })
          );

          // トランザクションを更新
          const { error: updateTransactionsError } = await supabase
            .from('transactions')
            .upsert(updatedTransactions);

          if (updateTransactionsError) {
            console.error('Error updating transactions:', updateTransactionsError);
          }

          // Zustandのstoreを更新
          setTransactions(updatedTransactions);
        }
      }

      setMessage('プロフィールを更新しました。');
    } catch (error) {
      setMessage('エラーが発生しました。' + error);
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="text-center font-bold text-xl mb-10">プロフィール</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* アバター画像 */}
        <div className="mb-5">
          <div className="flex flex-col text-sm items-center justify-center mb-5">
            <div className="relative w-24 h-24 mb-5">
              <Image src={avatarUrl} className="rounded-full object-cover" alt="avatar" fill />
            </div>
            <input type="file" id="avatar" onChange={onUploadImage} />
            {fileMessage && <div className="text-center text-red-500 my-5">{fileMessage}</div>}
          </div>
        </div>

        {/* 名前 */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">名前</div>
          <input
            type="text"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="名前"
            id="name"
            {...register('name', { required: true })}
            required
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.name?.message}</div>
        </div>

        {/* 自己紹介 */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">自己紹介</div>
          <textarea
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="自己紹介"
            id="introduce"
            {...register('introduce')}
            rows={5}
          />
        </div>

        {/* 主な通貨の選択 */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">主な通貨</div>
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

        {/* 変更ボタン */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-buttonPrimary hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              変更
            </button>
          )}
        </div>
      </form>

      {/* メッセージ */}
      {message && <div className="my-5 text-center text-red-500 mb-5">{message}</div>}
    </div>
  );
}

export default Profile;

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    } else {
      alert('Logged out successfully');
      router.push("/");
    }
  }

  return (
    <button className="hover:opacity-70" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;

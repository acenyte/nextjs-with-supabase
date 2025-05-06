import { createClient } from '@/utils/supabase/server';
import NotesClient from './NotesClient';

type Note = {
  id: string;
  content: string;
  image_url?: string;
};

export default async function Home() {
  const supabase = await createClient();
  
  // Get notes
  const { data: notes } = (await supabase.from("notes").select("*")) as {
    data: Note[];
  };

  // Get auth status
  const { data: { session } } = await supabase.auth.getSession();
  const isSignedIn = !!session;

  return <NotesClient notes={notes || []} isSignedIn={isSignedIn} />;
}

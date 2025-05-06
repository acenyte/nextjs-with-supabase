import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types' // Adjust the path as necessary

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase
    .from('notes')
    .select('*') as { data: Database['public']['Tables']['notes']['Row'][] }

  return (
    <div className="notes-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {notes?.map((note) => {
        // Generate a random pastel color
        const randomPastelColor = `hsl(${Math.random() * 360}, 70%, 85%)`;

        return (
          <div 
            key={note.id} 
            className="note-card shadow-md hover:shadow-lg transition-shadow rounded-lg" 
            style={{
              backgroundColor: randomPastelColor, // Set the random pastel color
              fontSize: '16px',
              width: '100%',
              height: 'fit-content',
              minHeight: '100px',
              fontFamily: `'Arial', sans-serif`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: '20px',
              overflow: 'hidden',
            }}
          >
            {note.image_url && <img src={note.image_url} alt="Thumbnail" className="thumbnail" />}
            <p>{note.content}</p>
          </div>
        );
      })}
    </div>
  );
}
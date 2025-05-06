"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import React from 'react';

type Note = {
  id: string;
  content: string;
  image_url?: string;
};

type NoteWithStyle = Note & {
  backgroundColor: string;
  fontFamily: string;
};

interface NotesClientProps {
  notes: Note[];
  isSignedIn: boolean;
}

const NotesClient: React.FC<NotesClientProps> = ({ notes, isSignedIn = false }) => {
  const [generation, setGeneration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [styledNotes, setStyledNotes] = useState<NoteWithStyle[]>([]);
  const [description, setDescription] = useState("");

  console.log("Is user signed in:", isSignedIn);

  useEffect(() => {
    const fontFamilies = [
      "'Arial', sans-serif",
      "'Courier New', monospace",
      "'Georgia', serif",
      "'Times New Roman', serif",
      "'Verdana', sans-serif",
    ];
    const fontColors = [
      "#eee4c0",
      "#f4ced8",
      "#b5d5a3",
      "#a7a2f6",
      "#9ab29f",
      "#d0ad9b",
      "#9ebcff",
    ];

    const styled = notes.map((note) => ({
      ...note,
      backgroundColor:
        fontColors[Math.floor(Math.random() * fontColors.length)],
      fontFamily: fontFamilies[Math.floor(Math.random() * fontFamilies.length)],
    }));

    setStyledNotes(styled.sort(() => Math.random() - 0.5));
  }, [notes]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newNote = {
      content: description,
      image_url: formData.get("thumbnail") as string,
    };

    const supabase = createClient();
    const { error } = await supabase.from("notes").insert([newNote]);

    if (error) {
      console.error("Error inserting note:", error);
      return;
    }

    // Refresh the page to show the new note
    window.location.reload();
    setOpenModal(false);
  };

  return (
    <div>
      {isSignedIn ? (
        <button
          onClick={() => setOpenModal(true)}
          style={{
            backgroundColor: "#2f902f",
            borderRadius: "5px",
            color: "white",
            fontWeight: "bold",
            padding: "5px",
            display: "block",
            margin: "0 auto",
          }}
        >
          + Add New Notice
        </button>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>
          SIGN IN TO ADD YOUR OWN NOTICE
        </p>
      )}
      {openModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ position: "relative" }}>
            <button
              onClick={() => setOpenModal(false)}
              className="close-button"
              style={{ position: "absolute", top: "10px", right: "10px" }}
            >
              X
            </button>
            <h2 style={{ margin: "0 0 20px 0", textAlign: "center" }}>
              ADD NEW NOTICE
            </h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="thumbnail">Thumbnail URL:</label>
              <br />
              <input
                type="text"
                id="thumbnail"
                name="thumbnail"
                placeholder="Enter thumbnail URL"
                style={{ border: "1px solid black", marginBottom: "10px" }}
              />
              <br />
              <label htmlFor="description">Description:</label>
              <br />
              <textarea
                id="description"
                name="description"
                required
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ border: "1px solid black", marginBottom: "2px" }}
              ></textarea>
              <div>
                <button
                  onClick={async () => {
                    setIsLoading(true);

                    await fetch("/api/completion", {
                      method: "POST",
                      body: JSON.stringify({
                        prompt: "Write a short notice board post, or poem or news article. Only 2 to 3 sentences long.",
                      }),
                    }).then((response) => {
                      console.log("Response:", response);
                      response.json().then((json) => {
                        setGeneration(json.text);
                        setDescription(json.text);
                        setIsLoading(false);
                      });
                    });
                  }}
                  style={{
                    border: "1px solid black",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    padding: "3px 6px",
                    marginTop: "0px",
                    marginBottom: "18px",
                    borderRadius: "5px",
                    float: "right",
                  }}
                >
                  Generate with AI ✨
                </button>

                {isLoading ? "Loading..." : ""}
              </div>
              <br />
              <button
                type="submit"
                style={{
                  display: "block",
                  margin: "0 auto",
                  borderRadius: "8px",
                  backgroundColor: "black",
                  color: "white",
                  padding: "10px 20px",
                }}
              >
                ✅ Submit
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="notes-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {styledNotes.map((note) => (
          <div
            key={note.id}
            className="note-card shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg"
            style={{
              backgroundColor: note.backgroundColor,
              fontSize: "16px",
              width: "100%",
              height: "fit-content",
              minHeight: "100px",
              fontFamily: note.fontFamily,
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: "20px",
              overflow: "hidden",
              fontWeight: "bold",
            }}
          >
            {note.image_url && (
              <img
                src={note.image_url}
                alt="Thumbnail"
                className="thumbnail"
                style={{
                  maxWidth: "90%",
                  maxHeight: "60%",
                  objectFit: "contain",
                }}
              />
            )}
            <br />
            <p
              style={{
                margin: "0",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                lineHeight: "1.2",
              }}
            >
              {note.content}
            </p>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesClient;

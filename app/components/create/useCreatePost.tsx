"use client";

import { useEffect, useState } from "react";
import { MediaItem } from "@/lib/users";

export function useCreatePost() {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [audience, setAudience] = useState<"everyone" | "followers" | "selected" | "closeFriends">("everyone");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [allowComments, setAllowComments] = useState(true);
  const [allowSharing, setAllowSharing] = useState(true);
  const [hideLikes, setHideLikes] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [scheduleAt, setScheduleAt] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);

  useEffect(() => {
    const tags =
      caption.match(/#\w+/g) || [];

    const users =
      caption.match(/@\w+/g) || [];

    setHashtags(tags);
    setMentions(users);
  }, [caption]);

  useEffect(() => {
    const draft =
      localStorage.getItem("draft-post");

    if (!draft) return;

    try {
      const parsed = JSON.parse(draft);

      setCaption(parsed.caption || "");
      setAudience(parsed.audience || "everyone");
      setSelectedUsers(parsed.selectedUsers || []);
      setLocation(parsed.location || "");
      setCollaborators(parsed.collaborators || [])
    } catch {
      console.error(
        "Failed to load draft"
      );
    }
  }, []);

  async function handleMediaUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      e.target.files || []
    );

    const uploaded: MediaItem[] =
      files.map((file, index) => ({
        id: crypto.randomUUID(),
        src: URL.createObjectURL(file),
        isVideo:
          file.type.startsWith(
            "video"
          ),
        order:
          media.length + index,
      }));

    setMedia((prev) => [
      ...prev,
      ...uploaded,
    ]);
  }

  const removeMedia = (
    id: string
  ) => {
    setMedia((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );

    setActiveMedia((prev) =>
      Math.max(0, prev - 1)
    );
  };

  const moveMedia = (
    currentIndex: number,
    direction:
      | "left"
      | "right"
  ) => {
    const updated = [...media];

    const targetIndex =
      direction === "left"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >=
        updated.length
    )
      return;

    [updated[currentIndex],updated[targetIndex]] = [updated[targetIndex],updated[currentIndex]];
    setMedia(updated);
  };

  const saveDraft = () => {
    localStorage.setItem(
      "draft-post",
      JSON.stringify({
        caption,
        audience,
        selectedUsers,
        location,
        collaborators,
      })
    );

    alert("Draft saved");
  };

  const addCollaborator = (
    username: string
  ) => {
    const trimmed =
      username.trim();

    if (!trimmed) return;

    if (
      collaborators.includes(
        trimmed
      )
    )
      return;

    setCollaborators(
      (prev) => [
        ...prev,
        trimmed,
      ]
    );
  };

  const removeCollaborator = (
    username: string
  ) => {
    setCollaborators(
      (prev) =>
        prev.filter(
          (u) =>
            u !== username
        )
    );
  };

  async function publishPost() {
    if (
      !caption.trim() &&
      media.length === 0
    ) {
      alert(
        "Add media or caption"
      );
      return;
    }

    const post = {
      caption,
      media,
      audience,
      selectedUsers,
      hashtags,
      taggedUsers: mentions,
      collaborators,
      location,
      isPinned,
      scheduleAt,
      allowComments,
      allowSharing,
      hideLikes,
    };

    try {
      const res = await fetch(
        "/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            post
          ),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed"
        );
      }

      localStorage.removeItem(
        "draft-post"
      );

      alert(
        "Post published"
      );

      setCaption("");
      setMedia([]);
      setLocation("");
      setSelectedUsers([]);
      setCollaborators([]);
      setHashtags([]);
      setMentions([]);
      setScheduleAt("");
      setActiveMedia(0);
    } catch {
      alert(
        "Failed to publish post"
      );
    }
  }

  return {
    caption,
    setCaption,
    location,
    setLocation,
    media,
    setMedia,
    audience,
    setAudience,
    selectedUsers,
    setSelectedUsers,
    allowComments,
    setAllowComments,
    allowSharing,
    setAllowSharing,
    hideLikes,
    setHideLikes,
    isPinned,
    setIsPinned,
    activeMedia,
    setActiveMedia,
    hashtags,
    mentions,
    scheduleAt,
    setScheduleAt,
    collaborators,
    addCollaborator,
    removeCollaborator,
    handleMediaUpload,
    removeMedia,
    moveMedia,
    saveDraft,
    publishPost,
  };
}


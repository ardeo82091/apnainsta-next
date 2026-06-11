"use client";

import CreateHeader from "./CreateHeader";
import MediaUploader from "./MediaUploader";
import MediaPreview from "./MediaPreview";
import CaptionSection from "./CaptionSection";
import PostOptions from "./PostOptions";
import AdvancedSettings from "./AdvancedSettings";
import PublishBar from "./PublishBar";
import { useCreatePost } from "./useCreatePost";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function CreatePostPage() {
  const post = useCreatePost();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto py-6 px-4 space-y-5">

        <CreateHeader 
          darkMode={darkMode}
        />

        <MediaUploader
          media={post.media}
          onUpload={post.handleMediaUpload}
          darkMode={darkMode}
        />

        {post.media.length > 0 && (
          <MediaPreview
            media={post.media}
            activeMedia={post.activeMedia}
            setActiveMedia={post.setActiveMedia}
            removeMedia={post.removeMedia}
            moveMedia={post.moveMedia}
            darkMode={darkMode}
          />
        )}

        <CaptionSection
          caption={post.caption}
          setCaption={post.setCaption}
          hashtags={post.hashtags}
          darkMode={darkMode}
        />

        <PostOptions
          audience={post.audience}
          setAudience={post.setAudience}
          location={post.location}
          setLocation={post.setLocation}
          collaborators={post.collaborators}
          addCollaborator={post.addCollaborator}
          selectedUsers={post.selectedUsers}
          setSelectedUsers={post.setSelectedUsers}
          darkMode={darkMode}
        />

        <AdvancedSettings
          allowComments={post.allowComments}
          setAllowComments={post.setAllowComments}
          allowSharing={post.allowSharing}
          setAllowSharing={post.setAllowSharing}
          hideLikes={post.hideLikes}
          setHideLikes={post.setHideLikes}
          isPinned={post.isPinned}
          setIsPinned={post.setIsPinned}
          altText={post.altText}
          setAltText={post.setAltText}
          scheduleAt={post.scheduleAt}
          setScheduleAt={post.setScheduleAt}
          darkMode={darkMode}
        />

        <PublishBar
          saveDraft={post.saveDraft}
          publishPost={post.publishPost}
          darkMode={darkMode}
        />

      </div>
    </div>
  );
}
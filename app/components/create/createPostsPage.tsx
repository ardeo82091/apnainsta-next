"use client";

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
<div className="mx-auto min-h-screen max-w-6xl px-4 py-5 pb-24 sm:px-6 sm:py-8 md:pb-8">
    <div className="mb-6"><h1 className="text-2xl font-bold sm:text-3xl">Create post</h1><p className="mt-1 text-sm text-gray-500">Share photos, videos, and updates with your community.</p></div>
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">

      <div className="space-y-5 lg:col-span-7">
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
            onUpload={post.handleMediaUpload}
          />
        )}

        <CaptionSection
          caption={post.caption}
          setCaption={post.setCaption}
          hashtags={post.hashtags}
          darkMode={darkMode}
        />

      </div>

      <div className="space-y-5 lg:col-span-5">

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
          scheduleAt={post.scheduleAt}
          setScheduleAt={post.setScheduleAt}
          darkMode={darkMode}
        />

      </div>

    </div>

    <div className="mt-6">
      <PublishBar
        saveDraft={post.saveDraft}
        publishPost={post.publishPost}
        darkMode={darkMode}
      />
    </div>

</div>
  );
}

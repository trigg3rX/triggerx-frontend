// src/components/DevhubItemSkeleton.js
import React from "react";

const SkeletonElement = ({ type, className = "" }) => {
  // Changed from #1A1A1A to a lighter shade
  const baseClasses = "bg-[#2A2A2A] rounded animate-pulse";
  let specificClasses = "";

  switch (type) {
    case "title":
      specificClasses = "h-10 w-3/4 mb-4";
      break;
    case "subtitle":
      specificClasses = "h-6 w-1/2 mb-10";
      break;
    case "image":
      specificClasses = "h-60 md:h-80 lg:h-96 w-full rounded-2xl md:rounded-3xl mb-8";
      break;
    case "line":
      specificClasses = "h-4 w-full mb-2";
      break;
    case "line-short":
      specificClasses = "h-4 w-5/6 mb-2";
      break;
    case "line-xs":
      specificClasses = "h-3 w-2/3 mb-2";
      break;
    case "button":
      specificClasses = "h-10 w-40 rounded-full";
      break;
    case "toc-title":
      specificClasses = "h-6 w-1/2 mb-4";
      break;
    case "toc-item":
      specificClasses = "h-4 w-full mb-2";
      break;
    case "heading":
      specificClasses = "h-8 w-1/3 mb-4";
      break;
    default:
      specificClasses = "h-4 w-full"; // Default paragraph line
  }

  return <div className={`${baseClasses} ${specificClasses} ${className}`}></div>;
};


const DevhubItemSkeleton = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 min-h-screen md:mt-[17rem] mt-[10rem] text-white">
      {/* Header Skeleton */}
      {/* <div className="max-w-4xl mx-auto text-center mb-16">
        <SkeletonElement type="title" className="mx-auto" />
        <SkeletonElement type="subtitle" className="mx-auto" />
      </div> */}

      {/* Main Content Area Skeleton */}
      <div className="bg-[#2A2A2A] rounded-3xl border border-gray-700 p-6 sm:p-8 md:p-10 lg:p-12 w-[95%] sm:w-[90%] mx-auto">
        <div className="mb-8 md:mb-12">
          {/* Image Skeleton */}
          <SkeletonElement type="image" className="w-full sm:w-[95%] mx-auto" />

          {/* Info Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-2 text-xs sm:text-sm text-white my-8 md:my-10 px-2 sm:px-4">
            <div className="space-y-3">
              <SkeletonElement type="line-xs" />
              <SkeletonElement type="line-xs" />
            </div>
            <div className="space-y-3">
              <SkeletonElement type="line-xs" />
              <SkeletonElement type="line-xs" />
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="flex justify-center mt-8 md:mt-10">
            <SkeletonElement type="button" />
          </div>
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 w-[95%] sm:w-[90%] mx-auto mt-10 md:mt-16">
        {/* TOC Skeleton */}
        <aside className="w-full md:w-1/4 lg:w-1/5 xl:w-[230px] order-first md:order-none mb-8 md:mb-0">
          <div className="hidden md:block sticky top-28 lg:top-32">
            <SkeletonElement type="toc-title" />
            <div className="space-y-3 mt-4">
              <SkeletonElement type="toc-item" />
              <SkeletonElement type="toc-item" />
              <SkeletonElement type="toc-item" />
              <SkeletonElement type="toc-item" className="w-3/4" />
            </div>
          </div>
          {/* Basic Mobile TOC Placeholder */}
          <div className="md:hidden mb-4">
            <SkeletonElement type="line" className="h-10" />
          </div>
        </aside>

        {/* Article Skeleton */}
        <article className="w-full md:w-3/4 lg:w-4/5 xl:flex-1 space-y-4">
          <SkeletonElement type="heading" />
          <SkeletonElement type="line" />
          <SkeletonElement type="line" />
          <SkeletonElement type="line-short" />
          <br />
          <SkeletonElement type="line" />
          <SkeletonElement type="line-short" />
          <br />
          <SkeletonElement type="heading" className="w-1/2" />
          <SkeletonElement type="line" />
          <SkeletonElement type="line-short" />
          <SkeletonElement type="line" />

        </article>
      </div>
    </div>
  );
};

export default DevhubItemSkeleton;
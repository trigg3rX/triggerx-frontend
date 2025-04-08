import React, { useState, useEffect } from "react";
import sanityClient from "../sanityClient"; 
import { FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const query = `*[_type == "post"] | order(_createdAt desc) {
  _id,     
  title,
  slug {
    current  
  },
  image {
    asset-> { 
      _id,    
      url
    }
  }
}`;

function Devhub() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching posts from Sanity...");
        const fetchedPosts = await sanityClient.fetch(query);
        console.log("Sanity fetch successful:", fetchedPosts);

        if (!Array.isArray(fetchedPosts)) {
          console.warn(
            "Sanity fetch did not return an array. Result:",
            fetchedPosts
          );
          setPosts([]);
        } else {
          setPosts(fetchedPosts);
        }
      } catch (err) {
        console.error("Error fetching posts from Sanity:", err);
        setError(err);
      } finally {
        setIsLoading(false);
        console.log("Finished fetching attempt.");
      }
    }

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  // Use the error state to display an error message
  if (error) {
    console.error("Rendering error state:", error);
    return (
      <div>
        Oops! We encountered an issue fetching data. Please try again later.
        Error: {error.message}
      </div>
    );
  }

  // Handle the case where the fetch was successful but returned no posts
  if (!isLoading && posts.length === 0) {
    return <div>No dev posts found.</div>;
  }

  const handleItemClick = (slug) => {
    if (!slug) {
      console.warn("Cannot navigate without a slug.");
      return;
    }

    navigate(`/devhub/${slug}`);
  };

  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem] w-[90%] mx-auto">
      <h4 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-left max-w-[1600px] mx-auto px-4 mb-8 flex items-center gap-3">
        Total{" "}
        <span className="text-[#FBF197] text-[25px]">
          {" "}
          {` { ${posts.length} } `}
        </span>
      </h4>{" "}
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mb-40">
          {posts.map((item) => {
            const currentSlug = item?.slug?.current;
            return (
              <div
                key={item._id}
                onClick={() => handleItemClick(currentSlug)}
                role="link"
                tabIndex={0}
                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-[#0F0F0F] p-3 border border-[#5F5F5F] flex flex-col justify-between cursor-pointer group"
              >
                <div className="w-full h-[200px] rounded-lg border border-[#5F5F5F] relative overflow-hidden">
                  {item.image?.asset?.url ? (
                    <img
                      src={item.image.asset.url}
                      alt={item.title}
                      className="h-full w-auto object-cover"
                    />
                  ) : (
                    <div className="w-full h-[200px] rounded-lg border border-[#5F5F5F] relative overflow-hidden">
                      <span>No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col ml-3">
                  <h2 className="font-actayWide text-base sm:text-xl transition-colors mt-4 sm:mt-8">
                    {item.title}
                  </h2>

                  <div className="flex items-center justify-center text-[#B7B7B7] group-hover:text-white py-5 rounded-lg w-max text-xs sm:text-sm ">
                    Read User Guide
                    <FaArrowUp className="ml-2 transform rotate-[45deg] group-hover:translate-x-[2px] transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Devhub;

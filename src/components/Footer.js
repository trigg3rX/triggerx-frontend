import React from 'react';
import { FaSquareXTwitter, FaGithub } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex gap-4">
          <a 
            href="https://x.com/_TriggerX"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <FaSquareXTwitter size={24} />
          </a>
          <a 
            href="https://github.com/trigg3rX"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <FaGithub size={24} />
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} TriggerX. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
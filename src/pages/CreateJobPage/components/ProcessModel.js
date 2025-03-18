import React from 'react';
import Modal from "react-modal";


const ProcessModal = ({ isOpen, steps,onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Estimate Fee"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl  w-[90%] max-w-md z-[10000]"
  overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"

    >
      <div className="">
        <h3 className="text-white text-xl mb-8 text-center">Creating Job</h3>
      
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 justify-between">

<h4 className={`text-md ${step.status === 'completed' ? 'text-white' : 'text-white'}`}>
                {step.text}
              </h4>
              
              {step.status === 'pending' && (
            <span className='flex items-center gap-3'>     <div className="w-5 h-5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"/> Pending</span>
              )}
              
              {step.status === 'completed' && (
                <span className='flex items-center gap-3'> <div className='border rounded-full bg-green-500 border-green-500'>   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg></div> completed 
             
                </span>
              )}
              {step.status === 'error' && (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              )}
              
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ProcessModal;
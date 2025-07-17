import React, { useState } from 'react';

const MobileMenu = ({ children, isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        aria-label="Toggle menu"
      >
        <div className="flex flex-col items-center justify-center w-6 h-6">
          <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
          <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white/10 backdrop-blur-md border-r border-white/20 
        transform transition-transform duration-300 ease-in-out z-40 lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="pt-16 p-6 h-full flex flex-col justify-between">
          {children}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 bg-white/10 backdrop-blur-md border-r border-white/20 p-6 flex-col justify-between shadow-lg z-10">
        {children}
      </div>
    </>
  );
};

export default MobileMenu;

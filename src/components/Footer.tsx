import React from 'react';

const items = [
  {
    person: 'Alfian',
    github: 'https://github.com/alfianlion',
  },
  {
    person: 'Nas',
    github: 'https://github.com/Coeeter',
  },
  {
    person: 'James',
    github: 'https://github.com/iFormal',
  },
  {
    person: 'Lucas',
    github: 'https://github.com/LucasH-HJH',
  },
  {
    person: 'Syahir',
    github: 'https://github.com/TheRealSyahir',
  },
];

export const Footer = () => {
  return (
    <footer className="w-full p-3 bg-slate-100 shadow-md">
      Made with ❤️ by{' '}
      {items.map(item => (
        <>
          <a
            href={item.github}
            className="text-blue-500 hover:text-blue-600 transition group font-bold relative"
          >
            {item.person}
            <span className="absolute bottom-0 left-0 w-full scale-x-0 h-[3px] bg-blue-500 rounded-full transition group-hover:scale-x-100 group-hover:bg-blue-600 origin-top-left"></span>
          </a>
          {item !== items[items.length - 1] && ', '}
        </>
      ))}
    </footer>
  );
};

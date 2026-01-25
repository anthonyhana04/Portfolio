import React from 'react';
import useFadeOnScroll from '../hooks/useFadeOnScroll';
import assets from '../utils/assets';

const About = () => {
  // data
  const educationData = {
    institution: "McMaster University",
    period: "2022 - 2027",
    degree: "Honours Mathematics & Computer Science (B.Sc)",
    location: "Hamilton, ON",
    coursework: [
      "Data Structures & Algorithms",
      "Computer Architecture",
      "Database Systems",
      "Natural Language Processing",
      "Numerical Linear Algebra",
      "Discrete Mathematics"
    ]
  };

  useFadeOnScroll('.fade-element', { threshold: 0.1, rootMargin: '0px' });


  return (
    <section id="about" className="bg-white text-black py-24 font-mono border-t border-black">
      <div className="container max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16 border-b border-black pb-6 fade-element">
          <span className="text-xs tracking-widest uppercase mb-2 block text-gray-500">
            01 // INTRODUCTION
          </span>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase">
            PROFILE<span className="hidden md:inline">_</span>LOG
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-l border-black">

          {/* Photos / Visuals Column */}
          <div className="lg:col-span-5 border-r border-b border-black p-8 relative group fade-element">
            {/* "Sticker" accent */}
            <div className="absolute top-4 right-4 border border-black px-2 py-1 text-[10px] bg-white z-10 uppercase">
              IMG_REF: 0042
            </div>

            <div className="relative overflow-hidden border border-gray-200 transition-all duration-500">
              <img
                src={assets['profile-photo-copy.jpg']}
                alt="Anthony Hana"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>



            {/* TypeScript Bio */}
            <div className="relative p-6 my-10 font-mono text-xs box-border group">
              {/* Solid Backdrop Shadow */}
              {/* Solid Backdrop Shadow */}
              <div className="absolute top-2 left-2 w-full h-full bg-gray-200 transition-colors duration-300 group-hover:bg-red-100"></div>

              {/* Main Card Background */}
              <div className="absolute top-0 left-0 w-full h-full bg-white"></div>

              {/* Abstract Borders */}
              <div className="absolute top-0 left-0 w-1/3 h-px bg-black transition-colors duration-300 group-hover:bg-red-500"></div>
              <div className="absolute top-0 right-0 w-1/4 h-px bg-black transition-colors duration-300 group-hover:bg-red-500"></div>
              <div className="absolute top-0 right-0 w-px h-1/2 bg-black transition-colors duration-300 group-hover:bg-red-500"></div>
              <div className="absolute bottom-0 right-8 w-1/3 h-px bg-black transition-colors duration-300 group-hover:bg-red-500"></div>
              <div className="absolute top-8 bottom-0 left-0 w-px bg-black transition-colors duration-300 group-hover:bg-red-500"></div>

              {/* Decor */}
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-black transition-colors duration-300 group-hover:bg-red-500"></div>

              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 font-bold tracking-widest uppercase transition-colors duration-300 group-hover:bg-red-100">
                PROFILE_DATA
              </span>

              <div className="flex flex-col gap-1 relative z-10">
                <div>
                  <span className="text-red-600">const</span>{' '}
                  <span className="text-gray-900">profile</span>
                  <span className="text-gray-500">: </span>
                  <span className="text-gray-900">Engineer</span>{' '}
                  <span className="text-gray-500">=</span>{' '}
                  <span className="text-gray-500">{`{`}</span>
                </div>

                <div className="pl-4 flex flex-col gap-0.5">
                  <div>
                    <span className="text-purple-700">name</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-blue-700">"Anthony Hana"</span>
                    <span className="text-gray-500">,</span>
                  </div>
                  <div>
                    <span className="text-purple-700">age</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-blue-600">21</span>
                    <span className="text-gray-500">,</span>
                  </div>
                  <div>
                    <span className="text-purple-700">location</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-blue-700">"Hamilton, ON, CA"</span>
                    <span className="text-gray-500">,</span>
                  </div>
                  <div>
                    <span className="text-purple-700">school</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-blue-700">"McMaster University"</span>
                    <span className="text-gray-500">,</span>
                  </div>
                  <div>
                    <span className="text-purple-700">program</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-blue-700">"Honours Math & CS"</span>
                    <span className="text-gray-500">,</span>
                  </div>
                  <div>
                    <span className="text-purple-700">workspace</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-blue-700">"LTV.ai"</span>
                    <span className="text-gray-500">,</span>
                  </div>
                  <div>
                    <span className="text-purple-700">role</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-blue-700">"AI & ML Engineer"</span>
                  </div>
                </div>

                <span className="text-gray-500">{`}`}</span>
              </div>

              {/* Vertical Text Decoration */}
              <div className="absolute top-6 bottom-6 right-6 font-mono text-[10px] leading-tight text-right text-gray-300 select-none flex flex-col justify-between pointer-events-none">
                <div className="opacity-20">this is me</div>
                <div className="opacity-40">this is me</div>
                <div className="opacity-60">this is me</div>
                <div className="opacity-30">this is me</div>
                <div className="opacity-50">this is me</div>
                <div className="opacity-20">this is me</div>
                <div className="opacity-70">this is me</div>
                <div className="opacity-40">this is me</div>
                <div className="opacity-30">this is me</div>
                <div className="opacity-20">this is me</div>
                <div className="opacity-100">{`>>`}end</div>
              </div>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="lg:col-span-7 flex flex-col">

            {/* Bio Block */}
            <div className="border-r border-b border-black p-8 md:p-12 fade-element group">
              <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-4">
                {/* Single Geometric Symbol */}
                <span className="font-mono text-2xl text-gray-200 transition-colors duration-300 group-hover:text-black select-none -translate-y-0.5">
                  ◆
                </span>
                WHO_AM_I
              </h3>
              <div className="text-sm md:text-base leading-relaxed opacity-80 space-y-6">
                <p>
                  I’m Anthony, a software engineer passionate about building systems that are fast and reliable, but also intuitive and user-centered. With a curious mind and a love for learning, I aim to turn complex challenges into clean, scalable solutions.
                </p>
                <p>
                  Whether it's exploring new cities on Google Maps or implementing high-throughput AI systems at LTV.ai, I am driven by exploration and optimization.
                </p>
                <p>
                  My background spans machine learning, full-stack development, and software architecture, honed through hackathons, internships, and leading cross-functional teams.
                </p>
              </div>
            </div>

            {/* Education Block */}
            <div className="border-r border-b border-black p-8 md:p-12 flex-grow fade-element group bg-white transition-colors duration-300">
              <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-4">
                {/* Advanced Geometric Symbol */}
                <span className="font-mono text-2xl text-gray-200 transition-colors duration-300 group-hover:text-black select-none -translate-y-0.5">
                  ◉
                </span>
                ACADEMIC_RECORD
              </h3>

              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                  <h4 className="text-2xl font-bold">{educationData.institution}</h4>
                  <span className="text-xs border border-current px-2 py-1 rounded-full uppercase mt-2 md:mt-0">
                    {educationData.period}
                  </span>
                </div>
                <p className="opacity-70 mb-1">{educationData.degree}</p>
                <p className="text-xs uppercase tracking-widest opacity-50">{educationData.location}</p>
              </div>

              <div className="text-xs border-t border-dashed border-gray-300 pt-6 opacity-80 group-hover:opacity-100 transition-opacity">
                <span className="block mb-3 uppercase tracking-widest font-bold">Relevant Coursework:</span>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {educationData.coursework.map((course, i) => (
                    <span key={i} className="hover:text-black hover:font-bold transition-all cursor-crosshair">
                      [ {course} ]
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* End of Section Log */}
        <div className="py-12 font-mono text-xs text-center opacity-40 select-none">
          {`+${'-'.repeat(30)}+`} <br />
          {`|   END_OF_SECTION_LOG   |`} <br />
          {`+${'-'.repeat(30)}+`}
        </div>

      </div >
    </section >
  );
};

export default About;
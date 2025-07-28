// src/components/about.jsx
import React from 'react';
import useFadeOnScroll from '../hooks/useFadeOnScroll';
import assets from '../utils/assets';

const About = () => {
  // data
  const educationData = {
    institution: "McMaster University",
    department: "Department of Mathematics & Statistics",
    period: "September 2022 - April 2027",
    degree: "Honours Mathematics and Computer Science (B.Sc)",
    coursework: "Data Structures & Algorithms, Computer Architechture, Databases, Natural Language Processing, Numerical Linear Algebra, Mathematical Modeling, Discreate Mathematics."
  };

  useFadeOnScroll('.about-content', {threshold: 0.4, rootMargin: '0px'});
  useFadeOnScroll('.education-content', {threshold: 0.4, rootMargin: '0px'});

  return (
    <section id="about" className="bg-white about-section py-20">
      <div className="container max-w-7xl mx-auto px-8 lg:px-6 md:px-4">
        <div className="about-content grid grid-cols-1 md:grid-cols-[3.3fr_1.7fr] gap-16 items-center mb-18 animate-fade-in">
          <div className="order-2 md:order-1">
            <h1 className="text-sm font-medium text-gray-500 tracking-widest uppercase mb-8 m-0">
              About Me
            </h1>
            <h2 className="text-3xl font-normal text-gray-900 mb-2 md:text-2xl sm:text-xl">
              It's so nice to meet you!
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 md:text-base sm:text-sm">
              I’m Anthony, a software engineer passionate about building systems that are fast and reliable, but also intuitive and user-centered. 
              With a curious mind and a love for learning and problem-solving, I aim to turn complex challenges into clean, scalable solutions. 
              For me, great software makes technology feel personal, purposeful, and a little fun.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 md:text-base sm:text-sm">
              A little fun fact about me is that I love to explore. Whether it’s spending hours on Google Maps virtually wandering through new cities or planning the perfect biking route around the city, 
              I’m fascinated by how place shapes experience, even if I can’t always get there myself. That curiosity extends into my work too. Right now, 
              I’m exploring the intersections software has with geography, recently building a real-time transit visualization tool that maps buses across Hamilton using GTFS data.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-0 md:text-base sm:text-sm">
              Along the way, I’ve had the opportunity to work with amazing teams through volunteering, clubs, and project-based work. 
              These experiences allowed me to dive into areas like machine learning, full-stack development, and software architecture. 
              Collaborating with others from small, tight-knit groups to larger cross-functional teams helped me grow both as an engineer and as a teammate.
            </p>
          </div>
          <div className="about-image flex justify-center md:justify-end order-1 md:order-2">
            <img
              src={assets['profile-photo-copy.jpg']}
              alt="Anthony Hana"
              className="w-94 rounded-xl shadow-xl border border-gray-200 hover:scale-105 transition-transform duration-300 md:w-80 sm:w-70"
            />
          </div>
        </div>

        <div className="education-section border-t border-gray-200 pt-12 md:pt-8 sm:pt-4">
          {/* move the label to the top-left of this container */}
          <h3
            className="section-label text-sm font-medium text-gray-500 tracking-widest uppercase mb-8"
          >
            EDUCATION
          </h3>
          <div className="education-content grid grid-cols-1 md:grid-cols-2 gap-y-14 gap-x-32 items-center animate-fade-in">
            
            {/* Image on the left */}
            <div className="education-image flex justify-center md:justify-start">
              <img
                src={assets['university-hall.jpg']}
                alt="Hamilton Hall at McMaster University"
                className="w-full h-full rounded-xl shadow-xl border border-gray-200
                          transition-transform duration-300 hover:scale-105
                          lg:h-76 md:h-100 sm:h-84"
              />
            </div>
            <div className="education-text flex flex-col justify-center">
              <h4 className="institution-name text-5xl font-semibold text-gray-900 mb-2 leading-tight md:text-4xl sm:text-3xl">
                {educationData.institution}
              </h4>
              <p className="department-name text-2xl font-normal text-gray-600 mb-0 md:text-xl sm:text-lg">
                {educationData.department}
              </p>
              <p className="education-period text-base text-gray-500 mb-4">
                {educationData.period}
              </p>
              <p className="degree-info text-lg font-normal text-gray-900 mb-4 leading-normal md:text-base">
                {educationData.degree}
              </p>
              <div className="coursework-section">
                <p className="coursework-text text-base text-gray-600 leading-relaxed m-0 sm:text-sm">
                  <strong className="text-gray-900 font-medium">Relevant Coursework:</strong>{' '}
                  {educationData.coursework}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </section>
  );
};

export default About;
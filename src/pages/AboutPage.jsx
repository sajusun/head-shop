import React from 'react';
import { motion } from 'framer-motion';
import { mockAboutData } from '../mock/about';
import { Target, Users, Globe, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
          >
            Our Journey
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-black text-text mb-8"
          >
            {mockAboutData.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto"
          >
            {mockAboutData.subtitle}
          </motion.p>
        </div>
        
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Story & Stats */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl font-black text-text mb-6">Our Story</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {mockAboutData.ourStory}
            </p>
            <div className="grid grid-cols-2 gap-8">
              {mockAboutData.stats.map((stat, i) => (
                <div key={i} className="border-l-4 border-primary pl-6 py-2">
                  <div className="text-3xl font-black text-text mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                alt="Our Team Workspace" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white">
                  <Award size={24} />
                </div>
                <div>
                  <div className="font-black text-text italic">Award Winning Design</div>
                  <div className="text-sm text-gray-500">Industry Recognition 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-24 bg-text text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-6">Our Vision & Core Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg italic">"{mockAboutData.vision}"</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Target className="text-primary" />, title: "Precision", desc: "Every detail matters. We obsessive over every stitch, pixel, and sound profile." },
              { icon: <Users className="text-secondary" />, title: "Community", desc: "Building a space where design lovers and tech enthusiasts feel at home." },
              { icon: <Globe className="text-accent" />, title: "Sustainability", desc: "Our planet is our priority. We use eco-friendly materials whenever possible." }
            ].map((value, i) => (
              <div key={i} className="bg-white/5 p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-text mb-4">The Minds Behind Herd</h2>
          <p className="text-gray-500">Creative individuals working together to build something unique.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {mockAboutData.team.map((member, i) => (
            <div key={i} className="group text-center">
              <div className="relative mb-6 mx-auto w-48 h-48 sm:w-64 sm:h-64">
                <div className="absolute inset-0 bg-primary/10 rounded-full scale-105 group-hover:scale-110 transition-transform"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-text">{member.name}</h3>
              <p className="text-gray-500 font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

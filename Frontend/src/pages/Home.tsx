import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Award, CreditCard, Users } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Course Management',
      description: 'Browse and explore all available courses with detailed information',
      link: '/courses',
      color: 'blue'
    },
    {
      icon: Award,
      title: 'Student Marks',
      description: 'View detailed marks and grades for all subjects',
      link: '/marks',
      color: 'green'
    },
    {
      icon: CreditCard,
      title: 'Fee Management',
      description: 'Track fee payments and outstanding balances',
      link: '/fees',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'User Account',
      description: 'Manage your account and access personalized features',
      link: '/login',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <GraduationCap className="h-16 w-16 text-blue-600" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            College Management
            <span className="block text-blue-600">Information System</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive portal for managing academic information, 
            tracking progress, and accessing essential college services.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to manage your academic journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className={`inline-flex p-3 rounded-lg transition-colors ${getColorClasses(feature.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="text-center space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600 mt-1">Available Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1,200+</div>
              <div className="text-gray-600 mt-1">Registered Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">98%</div>
              <div className="text-gray-600 mt-1">System Uptime</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
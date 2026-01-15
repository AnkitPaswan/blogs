import { 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  Award, 
  Heart,
  BookOpen,
  Globe,
  Star,
  CheckCircle
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Passion First",
    description: "We write what we love, sharing authentic insights and genuine perspectives on topics that matter."
  },
  {
    icon: Target,
    title: "Quality Over Quantity",
    description: "Every piece of content is carefully researched, thoughtfully crafted, and reviewed for accuracy and value."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Our readers inspire us. We listen, engage, and create content that sparks meaningful conversations."
  },
  {
    icon: Zap,
    title: "Stay Current",
    description: "In a fast-changing world, we commitment to keeping you informed with the latest trends and developments."
  }
];

const features = [
  {
    icon: BookOpen,
    title: "In-Depth Articles",
    description: "Well-researched long-form content that dives deep into topics, providing comprehensive insights."
  },
  {
    icon: Globe,
    title: "Diverse Perspectives",
    description: "Content spanning multiple domains including technology, lifestyle, business, and personal growth."
  },
  {
    icon: TrendingUp,
    title: "Industry Analysis",
    description: "Professional insights and analysis on market trends, innovations, and emerging opportunities."
  },
  {
    icon: Star,
    title: "Curated Resources",
    description: "Handpicked tools, resources, and recommendations to help you achieve your goals."
  }
];

const topics = [
  { name: "Technology & Innovation", count: "45+" },
  { name: "Personal Development", count: "38+" },
  { name: "Business & Finance", count: "32+" },
  { name: "Lifestyle & Wellness", count: "28+" },
  { name: "Career Growth", count: "25+" },
  { name: "Creative Arts", count: "20+" }
];

const stats = [
  { value: "150+", label: "Published Articles" },
  { value: "50K+", label: "Monthly Readers" },
  { value: "25K+", label: "Newsletter Subscribers" },
  { value: "98%", label: "Reader Satisfaction" }
];

export default function About() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            About BLOGS
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Empowering readers with thoughtful insights, expert analysis, and stories that inspire action.
          </p>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                BLOGS was born out of a simple yet powerful idea: everyone deserves access to 
                high-quality, well-researched content that enriches their lives and expands their horizons.
              </p>
              <p>
                What started as a small passion project in 2023 has grown into a thriving community 
                of curious minds, lifelong learners, and forward-thinkers. We believe that knowledge 
                shared is knowledge multiplied.
              </p>
              <p>
                Today, we continue to push boundaries, challenge conventions, and bring you stories 
                that matter. Every article, every analysis, and every resource is crafted with one 
                goal in mind: to make a positive impact in your journey.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <Award className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900">2023</p>
                  <p className="text-sm text-gray-500">Founded</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <Users className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900">10K+</p>
                  <p className="text-sm text-gray-500">Community</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <BookOpen className="w-10 h-10 text-pink-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900">150+</p>
                  <p className="text-sm text-gray-500">Articles</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <Globe className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900">50+</p>
                  <p className="text-sm text-gray-500">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize access to high-quality, actionable insights that empower individuals 
                and businesses to make informed decisions, grow continuously, and create meaningful 
                impact in their respective fields.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted destination for thoughtful, research-backed content that 
                inspires growth, fosters innovation, and builds a global community of learners and 
                leaders committed to positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            Our Core Values
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These principles guide everything we do and every decision we make.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-white/80 text-sm md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            What We Cover
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of topics, carefully curated to bring you valuable insights.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {topics.map((topic, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 md:p-5 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-gray-700 font-medium">{topic.name}</span>
              </div>
              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {topic.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              What We Offer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive content and resources designed to help you grow and succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
            Be part of a growing community of curious minds. Get the latest articles, insights, 
            and resources delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Join 25,000+ subscribers. No spam, unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Team/Connect Section */}
      <section className="bg-gray-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">
                Connect With Us
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Have questions, suggestions, or just want to say hello? We'd love to hear from you. 
                Follow us on social media for daily updates, behind-the-scenes content, and more.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300 text-sm font-medium">
                  Twitter
                </button>
                <button className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300 text-sm font-medium">
                  LinkedIn
                </button>
                <button className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300 text-sm font-medium">
                  Instagram
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-400">
                  <span className="w-24 text-sm">Email:</span>
                  <span className="text-white">hello@blogs.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <span className="w-24 text-sm">Location:</span>
                  <span className="text-white">Worldwide</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <span className="w-24 text-sm">Response:</span>
                  <span className="text-white">Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


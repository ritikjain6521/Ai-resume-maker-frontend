import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Product Manager at TechCorp",
      image: "https://i.pravatar.cc/150?img=1",
      content: "I was struggling to get interviews for 3 months. After rebuilding my resume with this AI tool and getting an ATS score of 95%, I landed 4 interviews in a week. Incredible!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Senior Software Engineer",
      image: "https://i.pravatar.cc/150?img=11",
      content: "The AI suggestions for bullet points are scarily accurate. It perfectly translated my technical jargon into business impact metrics that recruiters actually care about.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Marketing Director",
      image: "https://i.pravatar.cc/150?img=5",
      content: "The premium templates are gorgeous. Combining beautiful design with the ATS keyword optimization feature is what makes this platform the absolute best in the market.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Success Stories from Our Users
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Join thousands of professionals who landed their dream jobs using ResumeNova.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white dark:bg-surface p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 hover:shadow-md transition-shadow">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} className="fill-current" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 italic">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary-100 dark:border-primary-500/30" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

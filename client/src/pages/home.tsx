import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertContactSubmissionSchema, type InsertContactSubmission } from "@shared/schema";
import { 
  Code, 
  Lightbulb, 
  CheckCircle, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Menu,
  X,
  Zap
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertContactSubmission>({
    resolver: zodResolver(insertContactSubmissionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      service: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactSubmission) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message sent successfully!",
        description: data.message,
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactSubmission) => {
    contactMutation.mutate(data);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'services', 'about', 'portfolio', 'contact'];
      const navLinks = document.querySelectorAll('[data-nav-link]');
      
      let current = '';
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.getBoundingClientRect().top;
          const sectionHeight = section.offsetHeight;
          
          if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            current = sectionId;
          }
        }
      });
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
          link.classList.remove('text-muted-foreground');
          link.classList.add('text-foreground');
        } else {
          link.classList.remove('text-foreground');
          link.classList.add('text-muted-foreground');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                className="h-16 w-auto"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  data-nav-link
                  href="#hero"
                  data-testid="nav-home"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                  data-nav-link
                  href="#services"
                  data-testid="nav-services"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                  data-nav-link
                  href="#about"
                  data-testid="nav-about"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                  data-nav-link
                  href="#portfolio"
                  data-testid="nav-portfolio"
                >
                  Portfolio
                </button>
                <Button
                  onClick={() => scrollToSection('contact')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="nav-contact"
                >
                  Contact
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden" data-testid="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md border-b border-border">
              <button
                onClick={() => scrollToSection('hero')}
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 w-full text-left"
                data-testid="mobile-nav-home"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200 w-full text-left"
                data-testid="mobile-nav-services"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200 w-full text-left"
                data-testid="mobile-nav-about"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('portfolio')}
                className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200 w-full text-left"
                data-testid="mobile-nav-portfolio"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200 w-full text-left"
                data-testid="mobile-nav-contact"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
        <div className="tech-grid absolute inset-0 opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight" data-testid="hero-title">
              Building Tomorrow's
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Software Solutions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed" data-testid="hero-subtitle">
              Wizdom Software Ltd specializes in custom software development and cutting-edge AI SaaS products that transform businesses and drive innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => scrollToSection('services')}
                className="bg-white text-primary px-8 py-4 h-auto text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                data-testid="hero-cta-services"
              >
                Explore Our Services
              </Button>
              <Button
                onClick={() => scrollToSection('contact')}
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 h-auto text-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 bg-transparent"
                data-testid="hero-cta-contact"
              >
                Get In Touch
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="services-title">
              Our Core Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="services-subtitle">
              We deliver comprehensive software solutions tailored to your business needs, from custom development to AI-powered SaaS platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Custom Software Development */}
            <Card className="service-card p-8 border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" data-testid="service-custom-software">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Code className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="custom-software-title">
                    Custom Software Development
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed" data-testid="custom-software-description">
                    Tailored software solutions built from the ground up to meet your specific business requirements. We create scalable, secure, and maintainable applications using modern technologies.
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Web & Mobile Applications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Enterprise Solutions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">API Development & Integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Cloud Architecture & DevOps</span>
                  </div>
                </div>

                <Button
                  onClick={() => scrollToSection('contact')}
                  variant="link"
                  className="p-0 h-auto text-primary font-semibold hover:text-primary/80"
                  data-testid="custom-software-learn-more"
                >
                  Learn More 
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* AI SaaS Products */}
            <Card className="service-card p-8 border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" data-testid="service-ai-saas">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Lightbulb className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="ai-saas-title">
                    AI SaaS Products
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed" data-testid="ai-saas-description">
                    Cutting-edge AI-powered Software as a Service solutions that leverage machine learning and artificial intelligence to automate processes and drive business intelligence.
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Machine Learning Platforms</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Predictive Analytics Tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Natural Language Processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Computer Vision Solutions</span>
                  </div>
                </div>

                <Button
                  onClick={() => scrollToSection('contact')}
                  variant="link"
                  className="p-0 h-auto text-cyan-600 font-semibold hover:text-cyan-500"
                  data-testid="ai-saas-discover-more"
                >
                  Discover AI Solutions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="about-title">
                Why Choose Wizdom Software?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="about-description">
                With years of experience in software development and AI innovation, we bring deep technical expertise and industry knowledge to every project. Our team is passionate about creating solutions that drive real business value.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center" data-testid="stat-projects">
                  <div className="text-3xl font-bold text-primary mb-2">10+</div>
                  <div className="text-muted-foreground">Projects Delivered</div>
                </div>
                <div className="text-center" data-testid="stat-experience">
                  <div className="text-3xl font-bold text-primary mb-2">3+</div>
                  <div className="text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center" data-testid="stat-satisfaction">
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <div className="text-muted-foreground">Client Satisfaction</div>
                </div>
                <div className="text-center" data-testid="stat-support">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-muted-foreground">Support Available</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Expert Team</h4>
                    <p className="text-muted-foreground">Certified developers and AI specialists with proven track records</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Agile Methodology</h4>
                    <p className="text-muted-foreground">Iterative development process ensuring rapid delivery and quality</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Ongoing Support</h4>
                    <p className="text-muted-foreground">Comprehensive maintenance and support for long-term success</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Team collaboration in modern office" 
                className="rounded-2xl shadow-2xl w-full"
                data-testid="about-image"
              />
              
              <Card className="absolute -bottom-6 -left-6 p-6 shadow-lg border-border" data-testid="about-highlight-card">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">Fast Delivery</div>
                      <div className="text-muted-foreground">On-time, every time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="portfolio-title">
              Our Recent Work
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="portfolio-subtitle">
              Discover some of our successful projects that showcase our expertise in custom software development and AI solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">


             {/* Project 1 - DeepScreened.com */}
            <Card className="group overflow-hidden shadow-lg border-border hover:shadow-2xl transition-all duration-300" data-testid="portfolio-project-2">
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                  alt="DeepScreened AI Recruitment Platform" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 text-sm font-medium rounded-full">HR Tech</span>
                 <a
                  href="https://deepscreened.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit DeepScreened"
                >
                  <ExternalLink
                    className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors duration-200"
                  />
                </a>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3" data-testid="project-2-title">
                  DeepScreened AI Recruitment
                </h3>
                <p className="text-muted-foreground mb-4" data-testid="project-2-description">
                  AI-powered recruitment platform that transforms technical hiring with precision screening, eliminating bias and reducing hiring time from months to days with 28% cost savings.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Vue.js</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Python</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Machine Learning</span>
                </div>
              </CardContent>
            </Card>

            {/* Project 2 - Wizdomqa.com */}
            <Card className="group overflow-hidden shadow-lg border-border hover:shadow-2xl transition-all duration-300" data-testid="portfolio-project-wizdomqa">
              <div className="relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&h=400"
                  alt="WizdomQA — QA Automation Training (Selenium, Appium, API, CI/CD)"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-sm font-medium rounded-full">QA Training</span>
                  <a
                    href="https://www.wizdomqa.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit WizdomQA"
                  >
                    <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors duration-200" />
                  </a>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3" data-testid="project-wizdomqa-title">
                  WizdomQA — Test Automation Bootcamps
                </h3>

                <p className="text-muted-foreground mb-4" data-testid="project-wizdomqa-description">
                  Hands-on training to become an SDET: Selenium WebDriver, Appium (mobile), API automation, Docker & CI/CD, framework design and interview prep — led from Dublin, Ireland.
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Selenium</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Appium</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">API Automation</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Docker & CI/CD</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">SDET</span>
                </div>
              </CardContent>
            </Card>

            {/* Project 3 - Content Creation AI Assistant */}
            <Card className="group overflow-hidden shadow-lg border-border hover:shadow-2xl transition-all duration-300" data-testid="portfolio-project-1">
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                  alt="Content Creation AI Assistant" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-600 text-sm font-medium rounded-full">AI Blog</span>
                  
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3" data-testid="project-1-title">
                  Content Creation AI Assistant
                </h3>
                <p className="text-muted-foreground mb-4" data-testid="project-1-description">
                  Revolutionary AI-powered content creation platform that helps businesses generate high-quality blog posts, social media content, and marketing materials using advanced natural language processing.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">React</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">OpenAI</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">NLP</span>
                </div>
              </CardContent>
            </Card>

            {/* Project 4 - Agentic AI solution */}
            <Card
              className="group overflow-hidden shadow-lg border-border hover:shadow-2xl transition-all duration-300"
              data-testid="portfolio-project-agentic-ai"
            >
              <div className="relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&h=400"
                  alt="Agentic AI automations built with n8n"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-sm font-medium rounded-full">
                    Agentic AI
                  </span>
                  {/* no external link on purpose */}
                </div>

                <h3
                  className="text-xl font-bold text-foreground mb-3"
                  data-testid="project-agentic-title"
                >
                  Agentic AI Workflows with n8n
                </h3>

                <p
                  className="text-muted-foreground mb-4"
                  data-testid="project-agentic-description"
                >
                  Autonomous, event-driven agents orchestrated in n8n—planning, tool use, and
                  memory—to run end-to-end business processes. We connect LLMs with webhooks,
                  queues, and your data to automate complex workflows.
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">n8n</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">OpenAI</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Webhooks</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">PostgreSQL</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Redis / Queues</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">RAG</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Observability</span>
                </div>
              </CardContent>
            </Card>


           

          </div>

         
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="contact-title">
              Let's Build Something Amazing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="contact-subtitle">
              Ready to transform your ideas into reality? Get in touch with our team and let's discuss how we can help your business grow.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Contact Form */}
            <Card className="p-8 shadow-lg border-border" data-testid="contact-form-card">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-foreground mb-6" data-testid="contact-form-title">
                  Send us a Message
                </h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-company" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Interest</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-service">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="custom-software">Custom Software Development</SelectItem>
                              <SelectItem value="ai-saas">AI SaaS Products</SelectItem>
                              <SelectItem value="consulting">Technical Consulting</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={5} 
                              placeholder="Tell us about your project requirements..."
                              className="resize-none"
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-start space-x-3">
                      <Checkbox id="privacy" required data-testid="checkbox-privacy" />
                      <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-5">
                        I agree to the Privacy Policy and Terms of Service
                      </Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground py-4 h-auto text-lg font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={contactMutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                      {!contactMutation.isPending && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
       <footer className="bg-foreground text-background py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2 + 1 + 1 + 1 = 5 columns */}
        <div className="grid md:grid-cols-5 gap-8">
          {/* Company blurb */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4" data-testid="footer-company-name">
              Wizdom Software Ltd
            </h3>
            <p
              className="text-background/80 mb-6 leading-relaxed"
              data-testid="footer-description"
            >
              Transforming businesses through innovative custom software solutions and
              cutting-edge AI SaaS products. Your technology partner for the future.
            </p>

            <div className="flex space-x-4" data-testid="footer-social-links">
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors duration-200"
                aria-label="Twitter"
                data-testid="social-twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors duration-200"
                aria-label="LinkedIn"
                data-testid="social-linkedin"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors duration-200"
                aria-label="GitHub"
                data-testid="social-github"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.1.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 23.998 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-background/80">
              <li><button onClick={() => scrollToSection("services")} className="hover:text-background transition-colors duration-200">Custom Software</button></li>
              <li><button onClick={() => scrollToSection("services")} className="hover:text-background transition-colors duration-200">AI SaaS Products</button></li>
              <li><button onClick={() => scrollToSection("services")} className="hover:text-background transition-colors duration-200">Web Development</button></li>
              <li><button onClick={() => scrollToSection("services")} className="hover:text-background transition-colors duration-200">Mobile Apps</button></li>
              <li><button onClick={() => scrollToSection("services")} className="hover:text-background transition-colors duration-200">Cloud Solutions</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/80">
              <li><button onClick={() => scrollToSection("about")} className="hover:text-background transition-colors duration-200">About Us</button></li>
              <li><button onClick={() => scrollToSection("portfolio")} className="hover:text-background transition-colors duration-200">Portfolio</button></li>
              <li><button onClick={() => scrollToSection("contact")} className="hover:text-background transition-colors duration-200">Contact</button></li>
              <li><a href="#" className="hover:text-background transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="hover:text-background transition-colors duration-200">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <address className="not-italic space-y-3 text-background/80" data-testid="footer-contact">
              <p className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-background/60" />
                <span>
                  Wizdom Software Ltd<br />
                  62 Parklands Place,
                  Citywest, Dublin 24
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-background/60" />
                <a href="tel:+353894740999" className="hover:text-background transition-colors duration-200">
                  +353 894740999
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-background/60" />
                <a href="mailto:hello@wizdomsoftwares.com" className="hover:text-background transition-colors duration-200">
                  souvik.dutta@wizdomsoftwares.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* bottom bar */}
        <div
          className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          data-testid="footer-bottom"
        >
          <p className="text-background/60 text-sm">
            © 2025 Wizdom Software Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-background/60 hover:text-background text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-background/60 hover:text-background text-sm transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}

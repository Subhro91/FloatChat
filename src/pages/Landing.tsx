import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, BarChart2, Database, Github, Twitter, Linkedin, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-ocean.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const features = [
    {
      icon: MessageSquare,
      title: "Conversational Querying",
      description: "Ask questions in plain English. FloatChat understands your intent and fetches the relevant data."
    },
    {
      icon: BarChart2,
      title: "Instant Visualization", 
      description: "Go from question to insight in seconds with automatically generated charts and maps."
    },
    {
      icon: Database,
      title: "Complex Data, Simplified",
      description: "Access the vast ARGO dataset without needing to be a database expert."
    }
  ];

  return (
    <div className="min-h-screen bg-background gradient-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">FloatChat</div>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
              {user ? (
                <Button onClick={handleSignOut} className="glow-on-hover">
                  Log Out
                </Button>
              ) : (
                <Button onClick={() => navigate('/auth')} className="glow-on-hover">
                  Sign Up
                </Button>
              )}
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-sm z-40">
            <div className="container mx-auto px-6 py-8 flex flex-col items-center space-y-6">
              <a href="#features" className="text-lg text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#about" className="text-lg text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
              {user ? (
                <Button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="glow-on-hover w-full">Log Out</Button>
              ) : (
                <Button onClick={() => { navigate('/auth'); setIsMenuOpen(false); }} className="glow-on-hover w-full">Sign Up</Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative aurora-bg py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-ocean bg-clip-text text-transparent">
                Chat with the Ocean
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground mb-8">
                AI-Powered Data Discovery
              </h2>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                FloatChat translates your natural language questions into powerful visualizations of ARGO ocean data. No code, no complexity—just insights.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate(user ? '/app' : '/auth')}
                className="text-lg px-8 py-4 glow-primary"
              >
                Chat about oceans today
              </Button>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Oceanographic data visualization with glowing aurora effects" 
                className="rounded-xl shadow-2xl glow-on-hover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Powerful Features</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for scientists, researchers, and students who need to explore oceanographic data efficiently.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 border-border bg-card hover:bg-card/80 transition-all duration-300 glow-on-hover">
                <feature.icon className="w-12 h-12 text-primary mb-6" />
                <h4 className="text-xl font-semibold mb-4">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold mb-6">Revolutionizing Ocean Research</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              FloatChat bridges the gap between complex oceanographic datasets and intuitive exploration. 
              Our AI-powered platform makes it possible for researchers at any level to discover insights 
              in the vast ARGO float network data through simple conversations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-4">FloatChat</div>
              <p className="text-muted-foreground">
                AI-powered oceanographic data exploration platform for the scientific community.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <div className="flex space-x-4">
                <Twitter className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Github className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Linkedin className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 FloatChat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSocialAuth = async (provider: string) => {
    if (provider === 'Google') {
      try {
        await signInWithPopup(auth, googleProvider);
        toast({
          title: "Success!",
          description: "Logged in successfully.",
        });
        navigate('/'); // Change this from '/app' to '/'
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Coming Soon",
        description: `${provider} authentication will be available soon.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background aurora-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Back to Home */}
        <div className="text-center mb-8">
          <div 
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-primary transition-colors hover:text-primary/80 cursor-pointer"
          >
            FloatChat
          </div>
          <p className="text-muted-foreground mt-2">Ocean Data Intelligence Platform</p>
        </div>

        <Card className="bg-card/90 backdrop-blur-sm border-border glow-on-hover">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Welcome to FloatChat
            </CardTitle>
            <CardDescription>
              Sign in to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-border hover:bg-muted/50"
                onClick={() => handleSocialAuth('Google')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-border hover:bg-muted/50"
                onClick={() => handleSocialAuth('GitHub')}
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
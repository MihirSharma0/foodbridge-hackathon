import { Leaf, Heart, Github, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">FoodBridge</span>
            </div>
            <p className="text-primary-foreground/70 max-w-sm">
              Connecting food surplus with communities in need. Together, we're turning
              waste into impact, one meal at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li><a href="#how-it-works" className="hover:text-primary-foreground transition-colors">How It Works</a></li>
              <li><a href="#benefits" className="hover:text-primary-foreground transition-colors">Benefits</a></li>
              <li><a href="#join-platform" className="hover:text-primary-foreground transition-colors">Join Us</a></li>
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="font-semibold mb-4">Administration</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li><a href="/login?role=admin" className="hover:text-primary-foreground transition-colors flex items-center gap-2">Admin Login</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2026 FoodBridge. Made by EcoLogic Devs.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/mihir-sharma-data-ai/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com/MihirSharma0" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

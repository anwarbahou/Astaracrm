
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷"
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧"
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇲🇦"
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸"
  }
];

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    
    // Simulate language change - in a real app, this would trigger i18n
    console.log(`Switching to ${language.name} (${language.code})`);
    
    // You could dispatch a global state change here for actual translation
    // dispatch(setLanguage(language.code));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-9 px-3 hover:bg-muted/50 transition-colors duration-200"
        >
          <span className="text-base">{currentLanguage.flag}</span>
          <span className="text-sm font-medium hidden sm:inline">
            {currentLanguage.code.toUpperCase()}
          </span>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-popover border border-border shadow-lg animate-scale-in"
        sideOffset={8}
      >
        <div className="p-2">
          <div className="text-xs text-muted-foreground mb-2 px-2">
            Choisir la langue
          </div>
          
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              className="flex items-center gap-3 p-2 cursor-pointer hover:bg-muted/50 transition-colors duration-200 rounded-md"
              onClick={() => handleLanguageChange(language)}
            >
              <span className="text-lg">{language.flag}</span>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {language.nativeName}
                  </span>
                  {currentLanguage.code === language.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {language.name}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        
        <div className="border-t border-border mt-2 pt-2 px-2">
          <div className="text-xs text-muted-foreground px-2 py-1">
            Plus de langues bientôt disponibles
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

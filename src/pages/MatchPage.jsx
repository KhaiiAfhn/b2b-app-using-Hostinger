import React, { useState, useEffect, useMemo } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
    import { Textarea } from "@/components/ui/textarea";
    import { Label } from "@/components/ui/label";
    import { X, Check, Briefcase, MapPin, Users, Search, RotateCcw, Info, Copy, Send } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/AuthContext';

    const generateInitialEmail = (currentUserProfile, matchedUserProfile) => {
      const myCompany = currentUserProfile.companyName;
      const theirCompany = matchedUserProfile.companyName;
      const myIndustry = currentUserProfile.industry;
      const theirIndustry = matchedUserProfile.industry;
      const myLookingFor = (currentUserProfile.lookingFor || []).join(', ') || "new opportunities";
      const theirLookingFor = (matchedUserProfile.lookingFor || []).join(', ') || "potential collaborations";

      return `Subject: Exploring Synergies: ${myCompany} & ${theirCompany}

Dear ${theirCompany} Team,

My name is [Your Name] from ${myCompany}. We are a company in the ${myIndustry} sector, currently seeking ${myLookingFor}.

I came across your profile on B2B Connect and was impressed by your work in ${theirIndustry}, particularly your focus on ${theirLookingFor}. I believe there could be some exciting potential for collaboration between our companies.

Would you be open to a brief virtual coffee chat next week to explore how we might be able to support each other's goals?

Looking forward to hearing from you.

Best regards,

[Your Name]
[Your Title]
${myCompany}
${currentUserProfile.email}
[Your Phone Number (Optional)]`;
    };


    const MatchPage = () => {
      const { toast } = useToast();
      const { currentUser } = useAuth();
      const [profiles, setProfiles] = useState([]);
      const [currentIndex, setCurrentIndex] = useState(0);
      const [showDetails, setShowDetails] = useState(false);
      const [showEmailDialog, setShowEmailDialog] = useState(false);
      const [emailContent, setEmailContent] = useState('');
      const [targetEmailProfile, setTargetEmailProfile] = useState(null);


      useEffect(() => {
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const likedProfiles = JSON.parse(localStorage.getItem(`likedProfiles_${currentUser.id}`)) || [];
        const dislikedProfiles = JSON.parse(localStorage.getItem(`dislikedProfiles_${currentUser.id}`)) || [];
        const interactedProfileIds = [...likedProfiles, ...dislikedProfiles];

        const potentialMatches = allUsers.filter(
          (user) => user.id !== currentUser.id && !interactedProfileIds.includes(user.id)
        );
        setProfiles(potentialMatches);
        setCurrentIndex(0); 
      }, [currentUser]);

      const currentProfile = useMemo(() => profiles[currentIndex], [profiles, currentIndex]);

      const handleSwipe = (direction) => {
        if (!currentProfile) return;

        if (direction === 'right') {
          const likedProfiles = JSON.parse(localStorage.getItem(`likedProfiles_${currentUser.id}`)) || [];
          localStorage.setItem(`likedProfiles_${currentUser.id}`, JSON.stringify([...likedProfiles, currentProfile.id]));
          
          const theirLikes = JSON.parse(localStorage.getItem(`likedProfiles_${currentProfile.id}`)) || [];
          if (theirLikes.includes(currentUser.id)) {
            toast({
              title: "It's a Match!",
              description: `You and ${currentProfile.companyName} both liked each other!`,
              variant: "default",
              duration: 3000,
            });
            const matches = JSON.parse(localStorage.getItem(`matches_${currentUser.id}`)) || [];
            localStorage.setItem(`matches_${currentUser.id}`, JSON.stringify([...matches, currentProfile.id]));
            const theirMatches = JSON.parse(localStorage.getItem(`matches_${currentProfile.id}`)) || [];
            localStorage.setItem(`matches_${currentProfile.id}`, JSON.stringify([...theirMatches, currentUser.id]));
            
            // Prepare and show email dialog for mutual match
            setTargetEmailProfile(currentProfile);
            const generatedEmail = generateInitialEmail(currentUser, currentProfile);
            setEmailContent(generatedEmail);
            setShowEmailDialog(true);

          } else {
             toast({
              title: 'Liked!',
              description: `You liked ${currentProfile.companyName}. If they like you back, it's a match!`,
              variant: 'default',
            });
          }

        } else {
          toast({
            title: 'Passed',
            description: `You passed on ${currentProfile.companyName}.`,
            variant: 'destructive',
          });
          const dislikedProfiles = JSON.parse(localStorage.getItem(`dislikedProfiles_${currentUser.id}`)) || [];
          localStorage.setItem(`dislikedProfiles_${currentUser.id}`, JSON.stringify([...dislikedProfiles, currentProfile.id]));
        }
        
        // Only move to next if not showing email dialog (or if it's closed)
        // The dialog itself will handle moving to the next profile on close/action.
        if (direction === 'left' || (direction === 'right' && !(JSON.parse(localStorage.getItem(`likedProfiles_${currentProfile.id}`)) || []).includes(currentUser.id))) {
            setShowDetails(false); 
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
      };
      
      const handleEmailDialogClose = () => {
        setShowEmailDialog(false);
        setTargetEmailProfile(null);
        setShowDetails(false);
        setCurrentIndex((prevIndex) => prevIndex + 1); // Move to next profile after dialog is closed
      }

      const copyEmailToClipboard = () => {
        navigator.clipboard.writeText(emailContent);
        toast({
          title: "Email Copied!",
          description: "The draft email has been copied to your clipboard.",
        });
      };

      const simulateSendEmail = () => {
        toast({
          title: "Email Sent (Simulated)",
          description: `Your email to ${targetEmailProfile?.companyName} has been "sent".`,
        });
        handleEmailDialogClose();
      };


      const dragConstraints = { left: -200, right: 200, top: 0, bottom: 0 };
      const swipeThreshold = 100;

      const onDragEnd = (event, info) => {
        if (info.offset.x > swipeThreshold) {
          handleSwipe('right');
        } else if (info.offset.x < -swipeThreshold) {
          handleSwipe('left');
        }
      };
      
      const resetSwipes = () => {
        localStorage.removeItem(`likedProfiles_${currentUser.id}`);
        localStorage.removeItem(`dislikedProfiles_${currentUser.id}`);
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const potentialMatches = allUsers.filter(user => user.id !== currentUser.id);
        setProfiles(potentialMatches);
        setCurrentIndex(0);
        setShowDetails(false);
        toast({
          title: "Swipes Reset",
          description: "You can now re-evaluate all profiles.",
        });
      };


      if (!currentUser) {
        return <div className="text-center py-10 text-xl text-gray-300">Please log in to view matches.</div>;
      }
      
      if (profiles.length === 0 || currentIndex >= profiles.length) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center">
            <Search className="w-24 h-24 text-pink-500 mb-6" />
            <h2 className="text-3xl font-semibold text-gray-100 mb-4">No More Profiles</h2>
            <p className="text-gray-400 mb-6">You've seen all available profiles for now. Check back later!</p>
            <Button onClick={resetSwipes} variant="outline" className="text-pink-400 border-pink-500 hover:bg-pink-500/10 hover:text-pink-300">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Swipes
            </Button>
          </div>
        );
      }


      return (
        <div className="flex flex-col items-center justify-center p-4 relative min-h-[calc(100vh-16rem)]">
          <AnimatePresence>
            {currentProfile && (
              <motion.div
                key={currentProfile.id}
                drag="x"
                dragConstraints={dragConstraints}
                onDragEnd={onDragEnd}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ 
                  opacity: 0, 
                  x: currentProfile.id === targetEmailProfile?.id ? 0 : (info) => info.offset.x > 0 ? dragConstraints.right * 2 : dragConstraints.left * 2,
                  transition: { duration: 0.3 } 
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full max-w-md cursor-grab active:cursor-grabbing"
              >
                <Card className="bg-slate-800 border-slate-700 shadow-2xl overflow-hidden">
                  <CardHeader className="p-0 relative">
                    <div className="w-full h-64 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                      {currentProfile.logoUrl ? (
                        <img  src={currentProfile.logoUrl} alt={`${currentProfile.companyName} logo`} className="object-contain h-48 w-48 p-2 bg-white/10 rounded-lg backdrop-blur-sm" />
                      ) : (
                        <Briefcase className="w-32 h-32 text-white/70" />
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <CardTitle className="text-3xl font-bold text-white shadow-black [text-shadow:_0_2px_4px_var(--tw-shadow-color)]">{currentProfile.companyName}</CardTitle>
                      <CardDescription className="text-pink-300 font-medium">{currentProfile.industry}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-3 text-pink-400" />
                      <span>{currentProfile.location}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="w-5 h-5 mr-3 text-pink-400" />
                      <span>{currentProfile.companySize}</span>
                    </div>
                    <div className="text-gray-300">
                      <p className="font-semibold text-pink-400 mb-1">About Us:</p>
                      <p className={` ${showDetails ? '' : 'line-clamp-3'}`}>{currentProfile.description}</p>
                    </div>
                    {currentProfile.lookingFor && currentProfile.lookingFor.length > 0 && (
                      <div className="text-gray-300">
                        <p className="font-semibold text-pink-400 mb-1">Looking For:</p>
                        <div className="flex flex-wrap gap-2">
                          {currentProfile.lookingFor.map(item => (
                            <span key={item} className="px-3 py-1 bg-slate-700 text-sm rounded-full text-pink-300">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button variant="outline" onClick={() => setShowDetails(!showDetails)} className="w-full text-pink-400 border-pink-500 hover:bg-pink-500/10 hover:text-pink-300">
                      <Info className="mr-2 h-4 w-4" /> {showDetails ? 'Show Less' : 'Show More Details'}
                    </Button>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-4 p-6 pt-0">
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => handleSwipe('left')}
                      className="bg-red-500/80 hover:bg-red-600 text-white text-lg py-3"
                    >
                      <X className="mr-2 h-6 w-6" /> Pass
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => handleSwipe('right')}
                      className="bg-green-500/80 hover:bg-green-600 text-white text-lg py-3"
                    >
                      <Check className="mr-2 h-6 w-6" /> Like
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          {profiles.length > 0 && currentIndex < profiles.length && (
            <div className="mt-4 text-sm text-gray-400">
              Profile {currentIndex + 1} of {profiles.length}
            </div>
          )}
           <Button onClick={resetSwipes} variant="outline" className="absolute bottom-4 right-4 text-pink-400 border-pink-500 hover:bg-pink-500/10 hover:text-pink-300">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>

            <AlertDialog open={showEmailDialog} onOpenChange={(isOpen) => { if (!isOpen) handleEmailDialogClose(); }}>
                <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl gradient-text">It's a Match! Send an Intro?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            We've drafted an initial email to {targetEmailProfile?.companyName}. You can edit it below.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="emailContent" className="text-gray-300">Email to {targetEmailProfile?.email}:</Label>
                        <Textarea
                            id="emailContent"
                            value={emailContent}
                            onChange={(e) => setEmailContent(e.target.value)}
                            rows={12}
                            className="bg-slate-700 border-slate-600 text-gray-200 focus:border-pink-500"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleEmailDialogClose} className="text-gray-300 hover:bg-slate-700 border-slate-600">Maybe Later</AlertDialogCancel>
                        <Button variant="outline" onClick={copyEmailToClipboard} className="text-pink-400 border-pink-500 hover:bg-pink-500/10 hover:text-pink-300">
                            <Copy className="mr-2 h-4 w-4" /> Copy Email
                        </Button>
                        <AlertDialogAction onClick={simulateSendEmail} className="bg-green-500 hover:bg-green-600 text-white">
                            <Send className="mr-2 h-4 w-4" /> Send Email (Simulated)
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
      );
    };

    export default MatchPage;
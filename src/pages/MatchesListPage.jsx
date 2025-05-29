
    import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { useAuth } from '@/contexts/AuthContext';
    import { Users, MessageSquare, Briefcase, Search } from 'lucide-react';

    const MatchesListPage = () => {
      const { currentUser } = useAuth();
      const [matchedProfiles, setMatchedProfiles] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        if (currentUser) {
          const allUsers = JSON.parse(localStorage.getItem('users')) || [];
          const myMatchIds = JSON.parse(localStorage.getItem(`matches_${currentUser.id}`)) || [];
          
          const detailedMatches = myMatchIds
            .map(matchId => allUsers.find(user => user.id === matchId))
            .filter(Boolean); // Filter out any undefined if a user was deleted

          setMatchedProfiles(detailedMatches);
          setLoading(false);
        }
      }, [currentUser]);

      if (loading) {
        return <div className="text-center py-10 text-xl text-gray-300">Loading your matches...</div>;
      }

      if (!currentUser) {
        return <div className="text-center py-10 text-xl text-gray-300">Please log in to view your matches.</div>;
      }

      if (matchedProfiles.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center">
            <Users className="w-24 h-24 text-pink-500 mb-6" />
            <h2 className="text-3xl font-semibold text-gray-100 mb-4">No Matches Yet</h2>
            <p className="text-gray-400 mb-6">Keep swiping to find your B2B connections!</p>
            <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              <Link to="/match">
                <Search className="mr-2 h-4 w-4" /> Find Matches
              </Link>
            </Button>
          </div>
        );
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-8"
        >
          <h1 className="text-4xl font-bold mb-8 text-center gradient-text">Your Matches</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedProfiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-pink-500/30 transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center space-x-4 p-6">
                    <Avatar className="h-16 w-16 border-2 border-pink-500">
                      <AvatarImage src={profile.logoUrl || undefined} alt={`${profile.companyName} logo`} />
                      <AvatarFallback className="bg-slate-700 text-pink-400">
                        {profile.companyName ? profile.companyName.substring(0, 2).toUpperCase() : 'B2B'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-100">{profile.companyName}</CardTitle>
                      <CardDescription className="text-pink-400">{profile.industry}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-3">
                    <p className="text-gray-300 line-clamp-3">{profile.description}</p>
                    {profile.lookingFor && profile.lookingFor.length > 0 && (
                       <div className="text-gray-300">
                        <p className="font-semibold text-pink-400 mb-1 text-sm">Looking For:</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.lookingFor.slice(0,3).map(item => (
                            <span key={item} className="px-2 py-0.5 bg-slate-700 text-xs rounded-full text-pink-300">{item}</span>
                          ))}
                          {profile.lookingFor.length > 3 && <span className="px-2 py-0.5 bg-slate-700 text-xs rounded-full text-pink-300">+{profile.lookingFor.length -3} more</span>}
                        </div>
                      </div>
                    )}
                    <Button variant="outline" className="w-full text-pink-400 border-pink-500 hover:bg-pink-500/10 hover:text-pink-300 mt-2">
                      <MessageSquare className="mr-2 h-4 w-4" /> Message (Coming Soon)
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    };

    export default MatchesListPage;
  
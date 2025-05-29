import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/AuthContext';
    import { Briefcase, MapPin, Search, Users, Building, Mail, Edit3, Save } from 'lucide-react';

    const industries = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Real Estate", "Consulting", "Marketing", "Logistics", "Technology & IT", "Manufacturing & Industrial", "Agriculture & Agro-Tech", "Retail & Consumer Goods", "Other"];
    const companySizes = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"];
    const lookingForOptions = ["Partnership", "Investment", "Clients", "Suppliers", "Talent", "Networking", "Content Creators", "Technology Partners", "Innovation", "Startups", "Banks", "Financial Institutions", "SMEs", "Distributors", "Raw Material Suppliers", "Healthcare Sector", "International Buyers", "Industrial Clients", "Construction", "Automotive Sector", "Joint Ventures", "Sustainable Partners", "Research Institutions", "Franchisees", "Tenants", "Product Suppliers", "New Products", "Store Locations"];


    const ProfilePage = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const { currentUser, updateUser } = useAuth();
      const [isEditing, setIsEditing] = useState(false);
      const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        industry: '',
        location: '',
        companySize: '',
        description: '',
        lookingFor: [],
        logoUrl: '',
      });

      useEffect(() => {
        if (currentUser) {
          setFormData({
            companyName: currentUser.companyName || '',
            email: currentUser.email || '',
            industry: currentUser.industry || '',
            location: currentUser.location || '',
            companySize: currentUser.companySize || '',
            description: currentUser.description || '',
            lookingFor: currentUser.lookingFor || [],
            logoUrl: currentUser.logoUrl || '',
          });
        } else {
          navigate('/register'); 
        }
      }, [currentUser, navigate]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleMultiSelectChange = (name, value) => {
        setFormData((prev) => {
          const currentValues = prev[name] || [];
          if (currentValues.includes(value)) {
            return { ...prev, [name]: currentValues.filter(item => item !== value) };
          } else {
            return { ...prev, [name]: [...currentValues, value] };
          }
        });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.map(user => 
          user.id === currentUser.id ? { ...user, ...formData } : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        updateUser({ ...currentUser, ...formData }); 
        
        toast({
          title: 'Profile Updated!',
          description: 'Your company information has been saved.',
          variant: 'default',
        });
        setIsEditing(false);
      };

      if (!currentUser) {
        return <div className="text-center py-10 text-xl text-gray-300">Loading profile...</div>;
      }
      
      const formFields = [
        { name: "companyName", label: "Company Name", type: "text", icon: <Briefcase className="w-4 h-4 text-gray-400" /> },
        { name: "email", label: "Email Address", type: "email", icon: <Mail className="w-4 h-4 text-gray-400" />, disabled: true },
        { name: "industry", label: "Industry", type: "select", options: [...new Set(industries)].sort(), icon: <Building className="w-4 h-4 text-gray-400" /> },
        { name: "location", label: "Location", type: "text", icon: <MapPin className="w-4 h-4 text-gray-400" /> },
        { name: "companySize", label: "Company Size", type: "select", options: companySizes, icon: <Users className="w-4 h-4 text-gray-400" /> },
        { name: "description", label: "Company Description", type: "textarea", icon: null },
        { name: "lookingFor", label: "Looking For", type: "multiselect", options: [...new Set(lookingForOptions)].sort(), icon: <Search className="w-4 h-4 text-gray-400" /> },
        { name: "logoUrl", label: "Company Logo URL", type: "url", icon: null },
      ];

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-start py-8"
        >
          <Card className="w-full max-w-3xl bg-slate-800/80 border-slate-700 shadow-2xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-bold gradient-text">My Company Profile</CardTitle>
                <CardDescription className="text-gray-400">View and manage your company's information.</CardDescription>
              </div>
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="text-pink-400 border-pink-500 hover:bg-pink-500/10 hover:text-pink-300">
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
                {isEditing ? 'View Mode' : 'Edit Profile'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-8">
                <Avatar className="w-32 h-32 mb-4 border-4 border-pink-500">
                  <AvatarImage src={formData.logoUrl || undefined} alt={`${formData.companyName} logo`} />
                  <AvatarFallback className="bg-slate-700 text-pink-400 text-4xl">
                    {formData.companyName ? formData.companyName.substring(0, 2).toUpperCase() : 'B2B'}
                  </AvatarFallback>
                </Avatar>
                {!isEditing && <h2 className="text-2xl font-semibold text-gray-100">{formData.companyName}</h2>}
                {!isEditing && <p className="text-gray-400">{formData.email}</p>}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {formFields.map(field => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="text-gray-300 flex items-center">
                      {field.icon && <span className="mr-2">{field.icon}</span>}
                      {field.label}
                    </Label>
                    {!isEditing ? (
                      <p className="text-gray-200 p-3 bg-slate-700/50 rounded-md min-h-[40px] break-words">
                        {field.name === 'lookingFor' ? (formData[field.name] || []).join(', ') || 'Not specified' : formData[field.name] || 'Not specified'}
                      </p>
                    ) : field.type === 'textarea' ? (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="bg-slate-700 border-slate-600 text-gray-200 focus:border-pink-500"
                        rows={4}
                      />
                    ) : field.type === 'select' ? (
                      <Select onValueChange={(value) => handleSelectChange(field.name, value)} value={formData[field.name]}>
                        <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-gray-200 focus:border-pink-500">
                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
                          {field.options.map(option => (
                            <SelectItem key={option} value={option} className="hover:bg-slate-600 focus:bg-slate-600">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === 'multiselect' ? (
                      <div className="space-y-2 p-3 bg-slate-700 border border-slate-600 rounded-md max-h-48 overflow-y-auto">
                        {field.options.map(option => (
                          <div key={option} className="flex items-center">
                            <input 
                              type="checkbox"
                              id={`${field.name}-${option}`}
                              value={option}
                              checked={(formData[field.name] || []).includes(option)}
                              onChange={() => handleMultiSelectChange(field.name, option)}
                              className="h-4 w-4 text-pink-600 bg-slate-600 border-slate-500 rounded focus:ring-pink-500 mr-2"
                            />
                            <Label htmlFor={`${field.name}-${option}`} className="text-gray-300 font-normal">{option}</Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="bg-slate-700 border-slate-600 text-gray-200 focus:border-pink-500"
                        disabled={field.disabled}
                      />
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 text-lg">
                    <Save className="mr-2 h-5 w-5" /> Save Changes
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default ProfilePage;
import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/AuthContext';
    import { Briefcase, MapPin, Search, Users, Building, Mail } from 'lucide-react';

    const industries = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Real Estate", "Consulting", "Marketing", "Logistics", "Technology & IT", "Manufacturing & Industrial", "Agriculture & Agro-Tech", "Retail & Consumer Goods", "Other"];
    const companySizes = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"];
    const lookingForOptions = ["Partnership", "Investment", "Clients", "Suppliers", "Talent", "Networking", "Content Creators", "Technology Partners", "Innovation", "Startups", "Banks", "Financial Institutions", "SMEs", "Distributors", "Raw Material Suppliers", "Healthcare Sector", "International Buyers", "Industrial Clients", "Construction", "Automotive Sector", "Joint Ventures", "Sustainable Partners", "Research Institutions", "Franchisees", "Tenants", "Product Suppliers", "New Products", "Store Locations"];


    const RegisterPage = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const { login } = useAuth();
      const [isLogin, setIsLogin] = useState(false);

      const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
        industry: '',
        location: '',
        companySize: '',
        description: '',
        lookingFor: [],
        logoUrl: '',
      });

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
        if (isLogin) {
          // Login logic
          const users = JSON.parse(localStorage.getItem('users')) || [];
          const user = users.find(u => u.email === formData.email && u.password === formData.password);
          if (user) {
            login(user); // Set current user in AuthContext
            toast({
              title: 'Login Successful!',
              description: `Welcome back, ${user.companyName}!`,
              variant: 'default',
            });
            navigate('/match');
          } else {
            toast({
              title: 'Login Failed',
              description: 'Invalid email or password.',
              variant: 'destructive',
            });
          }
        } else {
          // Registration logic
          if (formData.password !== formData.confirmPassword) {
            toast({
              title: 'Error',
              description: 'Passwords do not match.',
              variant: 'destructive',
            });
            return;
          }
          const newUser = { ...formData, id: Date.now().toString() };
          delete newUser.confirmPassword; 
          
          const users = JSON.parse(localStorage.getItem('users')) || [];
          if (users.find(u => u.email === newUser.email)) {
            toast({
              title: 'Registration Failed',
              description: 'An account with this email already exists.',
              variant: 'destructive',
            });
            return;
          }
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          
          login(newUser); // Log in the new user immediately
          toast({
            title: 'Registration Successful!',
            description: `Welcome, ${newUser.companyName}! Your profile is created.`,
            variant: 'default',
          });
          navigate('/match');
        }
      };
      
      const formFields = [
        { name: "companyName", label: "Company Name", type: "text", icon: <Briefcase className="w-4 h-4 text-gray-400" />, required: !isLogin },
        { name: "email", label: "Email Address", type: "email", icon: <Mail className="w-4 h-4 text-gray-400" />, required: true },
        { name: "password", label: "Password", type: "password", icon: null, required: true },
        { name: "confirmPassword", label: "Confirm Password", type: "password", icon: null, required: !isLogin },
        { name: "industry", label: "Industry", type: "select", options: [...new Set(industries)].sort(), icon: <Building className="w-4 h-4 text-gray-400" />, required: !isLogin },
        { name: "location", label: "Location (e.g. City, Country)", type: "text", icon: <MapPin className="w-4 h-4 text-gray-400" />, required: !isLogin },
        { name: "companySize", label: "Company Size", type: "select", options: companySizes, icon: <Users className="w-4 h-4 text-gray-400" />, required: !isLogin },
        { name: "description", label: "Company Description (What you do)", type: "textarea", icon: null, required: !isLogin },
        { name: "lookingFor", label: "Looking For (Select multiple)", type: "multiselect", options: [...new Set(lookingForOptions)].sort(), icon: <Search className="w-4 h-4 text-gray-400" />, required: !isLogin },
        { name: "logoUrl", label: "Company Logo URL (Optional)", type: "url", icon: null, required: false },
      ];

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-start py-8"
        >
          <Card className="w-full max-w-2xl bg-slate-800/80 border-slate-700 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold gradient-text">{isLogin ? 'Login' : 'Join Now'}</CardTitle>
              <CardDescription className="text-gray-400">
                {isLogin ? 'Access your account and find your next B2B partner.' : 'Create your company profile and start connecting.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {formFields.map(field => {
                  if (isLogin && !['email', 'password'].includes(field.name)) return null;
                  if (!field.required && isLogin) return null;

                  return (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name} className="text-gray-300 flex items-center">
                        {field.icon && <span className="mr-2">{field.icon}</span>}
                        {field.label}
                        {field.required && <span className="text-pink-500 ml-1">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          required={field.required}
                          className="bg-slate-700 border-slate-600 text-gray-200 focus:border-pink-500"
                          rows={4}
                        />
                      ) : field.type === 'select' ? (
                        <Select onValueChange={(value) => handleSelectChange(field.name, value)} value={formData[field.name]} required={field.required}>
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
                          required={field.required}
                          className="bg-slate-700 border-slate-600 text-gray-200 focus:border-pink-500"
                        />
                      )}
                    </div>
                  );
                })}
                <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 text-lg">
                  {isLogin ? 'Login' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-pink-400 hover:text-pink-300">
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default RegisterPage;
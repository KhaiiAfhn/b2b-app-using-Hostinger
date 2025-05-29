import React, { createContext, useState, useContext, useEffect } from 'react';

    const AuthContext = createContext(null);

    const preloadedCompanies = [
      { id: "preloaded-1", companyName: "Fusionex", email: "contact@fusionexgroup.com", password: "password123", industry: "Technology & IT", location: "Kuala Lumpur", companySize: "500+ employees", description: "Leading provider of enterprise software solutions.", lookingFor: ["Partnership", "Clients"], logoUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400" },
      { id: "preloaded-2", companyName: "iflix", email: "support@iflix.com", password: "password123", industry: "Technology & IT", location: "Kuala Lumpur", companySize: "201-500 employees", description: "Streaming service for emerging markets.", lookingFor: ["Investment", "Content Creators"], logoUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400" },
      { id: "preloaded-3", companyName: "GHL Systems", email: "info@ghl.com", password: "password123", industry: "Technology & IT", location: "Kuala Lumpur", companySize: "201-500 employees", description: "Payment solutions provider.", lookingFor: ["Clients", "Technology Partners"], logoUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=400" },
      { id: "preloaded-4", companyName: "Telekom Malaysia", email: "help@tm.com.my", password: "password123", industry: "Technology & IT", location: "Kuala Lumpur", companySize: "500+ employees", description: "National telecommunications company.", lookingFor: ["Innovation", "Suppliers"], logoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c7da?q=80&w=400" },
      { id: "preloaded-5", companyName: "Time dotCom", email: "cs@time.com.my", password: "password123", industry: "Technology & IT", location: "Kuala Lumpur", companySize: "500+ employees", description: "Fixed-line telecommunications provider.", lookingFor: ["Partnership"], logoUrl: "https://images.unsplash.com/photo-1586953208448-3151cf797d50?q=80&w=400" },
      { id: "preloaded-6", companyName: "Mesiniaga", email: "contact@mesiniaga.com.my", password: "password123", industry: "Technology & IT", location: "Selangor", companySize: "201-500 employees", description: "IT solutions and services.", lookingFor: ["Clients"], logoUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400" },
      { id: "preloaded-7", companyName: "Axiata Digital", email: "info@axiatadigital.com", password: "password123", industry: "Technology & IT", location: "Kuala Lumpur", companySize: "500+ employees", description: "Digital services arm of Axiata Group.", lookingFor: ["Investment", "Startups"], logoUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=400" },
      { id: "preloaded-8", companyName: "Silverlake Group", email: "enquiry@silverlakegroup.com", password: "password123", industry: "Technology & IT", location: "Selangor", companySize: "500+ employees", description: "Financial software solutions.", lookingFor: ["Banks", "Financial Institutions"], logoUrl: "https://images.unsplash.com/photo-1560439514-494f100092d6?q=80&w=400" },
      { id: "preloaded-9", companyName: "Exabytes", email: "sales@exabytes.my", password: "password123", industry: "Technology & IT", location: "Penang", companySize: "51-200 employees", description: "Web hosting and cloud services.", lookingFor: ["SMEs", "Startups"], logoUrl: "https://images.unsplash.com/photo-1551802090-20a7a36c3659?q=80&w=400" },
      { id: "preloaded-10", companyName: "StoreHub", email: "care@storehub.com", password: "password123", industry: "Technology & IT", location: "Kuala Lumpur", companySize: "51-200 employees", description: "Cloud-based POS and retail management.", lookingFor: ["Retailers", "F&B Businesses"], logoUrl: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=400" },
      { id: "preloaded-11", companyName: "Top Glove Corporation", email: "info@topglove.com", password: "password123", industry: "Manufacturing & Industrial", location: "Selangor", companySize: "500+ employees", description: "World's largest manufacturer of gloves.", lookingFor: ["Distributors", "Raw Material Suppliers"], logoUrl: "https://images.unsplash.com/photo-1578575437130-5207addc50cc?q=80&w=400" },
      { id: "preloaded-12", companyName: "Hartalega Holdings", email: "info@hartalega.com.my", password: "password123", industry: "Manufacturing & Industrial", location: "Selangor", companySize: "500+ employees", description: "Leading nitrile glove manufacturer.", lookingFor: ["Healthcare Sector", "International Buyers"], logoUrl: "https://images.unsplash.com/photo-1614029002378-799351329895?q=80&w=400" },
      { id: "preloaded-13", companyName: "Kossan Rubber", email: "info@kossan.com.my", password: "password123", industry: "Manufacturing & Industrial", location: "Selangor", companySize: "500+ employees", description: "Rubber products and glove manufacturing.", lookingFor: ["Industrial Clients"], logoUrl: "https://images.unsplash.com/photo-1581092916380-9f5098f4f7e6?q=80&w=400" },
      { id: "preloaded-14", companyName: "Press Metal", email: "enquiry@pressmetal.com", password: "password123", industry: "Manufacturing & Industrial", location: "Selangor", companySize: "500+ employees", description: "Aluminium smelting and extrusion.", lookingFor: ["Construction", "Automotive Sector"], logoUrl: "https://images.unsplash.com/photo-1580900999090-ba87296d1007?q=80&w=400" },
      { id: "preloaded-15", companyName: "UMW Holdings", email: "info@umw.com.my", password: "password123", industry: "Manufacturing & Industrial", location: "Kuala Lumpur", companySize: "500+ employees", description: "Conglomerate in automotive, equipment, manufacturing.", lookingFor: ["Suppliers", "Joint Ventures"], logoUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400" },
      { id: "preloaded-16", companyName: "Sime Darby Plantation", email: "communications@simedarbyplantation.com", password: "password123", industry: "Agriculture & Agro-Tech", location: "Selangor", companySize: "500+ employees", description: "World's largest palm oil plantation company by planted area.", lookingFor: ["Sustainable Partners", "Research Institutions"], logoUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=400" },
      { id: "preloaded-17", companyName: "Padini Holdings", email: "customer@padini.com", password: "password123", industry: "Retail & Consumer Goods", location: "Selangor", companySize: "500+ employees", description: "Fashion retail group.", lookingFor: ["Franchisees", "Suppliers"], logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400" },
      { id: "preloaded-18", companyName: "Aeon Co. (M)", email: "feedback@aeonretail.com.my", password: "password123", industry: "Retail & Consumer Goods", location: "Kuala Lumpur", companySize: "500+ employees", description: "Retail stores and shopping malls.", lookingFor: ["Tenants", "Product Suppliers"], logoUrl: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=400" },
      { id: "preloaded-19", companyName: "7-Eleven Malaysia", email: "cs@7eleven.com.my", password: "password123", industry: "Retail & Consumer Goods", location: "Kuala Lumpur", companySize: "500+ employees", description: "Convenience store chain.", lookingFor: ["New Products", "Franchisees"], logoUrl: "https://images.unsplash.com/photo-1585298723682-7115561c51b7?q=80&w=400" },
      { id: "preloaded-20", companyName: "MR D.I.Y.", email: "customercare@mrdiy.com", password: "password123", industry: "Retail & Consumer Goods", location: "Kuala Lumpur", companySize: "500+ employees", description: "Home improvement retailer.", lookingFor: ["Suppliers", "Store Locations"], logoUrl: "https://images.unsplash.com/photo-1581594549540-16e171a7040b?q=80&w=400" },
    ];
    
    const initializePreloadedData = () => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const preloadedCompanyEmails = preloadedCompanies.map(pc => pc.email);
      const existingPreloaded = users.filter(user => preloadedCompanyEmails.includes(user.email));
    
      if (existingPreloaded.length < preloadedCompanies.length) {
        const newPreloadedToAdd = preloadedCompanies.filter(
          pc => !users.some(user => user.email === pc.email)
        );
        const updatedUsers = [...users, ...newPreloadedToAdd];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      } else if (users.length === 0) {
         localStorage.setItem('users', JSON.stringify(preloadedCompanies));
      }
    };


    export const AuthProvider = ({ children }) => {
      const [currentUser, setCurrentUser] = useState(null);

      useEffect(() => {
        initializePreloadedData();
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem('currentUser');
          }
        }
      }, []);

      const login = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      };

      const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      };

      const updateUser = (updatedData) => {
        setCurrentUser(updatedData);
        localStorage.setItem('currentUser', JSON.stringify(updatedData));
      };

      return (
        <AuthContext.Provider value={{ currentUser, login, logout, updateUser }}>
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
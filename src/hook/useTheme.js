export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Load theme from localStorage
    // Apply theme to document
  }, [isDarkMode]);
  
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  return { isDarkMode, toggleTheme };
};

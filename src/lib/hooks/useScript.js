import React, { useState, useEffect } from 'react';

let cachedScripts = [];
const useScript = src => {
  // Keeping track of script loaded and error state
  const [state, setState] = useState({
    scriptLoaded: false,
    scriptError: false,
  });

  useEffect(
    () => {
      // If cachedScripts array already includes src that means another instance ...
      // ... of this hook already loaded this script, so no need to load again.
      if (cachedScripts.includes(src)) {
        setState({
          scriptLoaded: true,
          scriptError: false,
        });
      } else {
        cachedScripts.push(src);

        // Create script
        let script = document.createElement('script');
        script.src = src;
        script.async = true;

        // Script event listener callbacks for load and error
        const onScriptLoad = () => {
          setState({
            scriptLoaded: true,
            scriptError: false,
          });
        };

        const onScriptError = () => {
          // Remove from cachedScripts we can try loading again
          const index = cachedScripts.indexOf(src);
          if (index >= 0) cachedScripts.splice(index, 1);
          script.remove();

          setState({
            scriptLoaded: true,
            scriptError: true,
          });
        };

        script.addEventListener('load', onScriptLoad);
        script.addEventListener('error', onScriptError);

        // Add script to document body
        document.body.appendChild(script);

        // Remove event listeners on cleanup
        return () => {
          script.removeEventListener('load', onScriptLoad);
          script.removeEventListener('error', onScriptError);
        };
      }
    },
    [src] // Only re-run effect if script src changes
  );

  return [state.scriptLoaded, state.scriptError];
};

export default useScript;
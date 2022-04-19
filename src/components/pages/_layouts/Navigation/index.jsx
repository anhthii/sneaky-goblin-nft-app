import React from 'react';
import { useLocation } from 'react-router-dom';

// Different Navigations
import MintNavigation from '../MintNavigation';
import StakingNavigation from '../StakingNavigation';

const Navigation = () => {
    const { pathname } = useLocation();

    const whichNav = () => {
        if (pathname === '/mint') return <MintNavigation />;
        if (pathname === '/invasion') return <StakingNavigation />;
        return <span>.</span>;
    };

    return <>{whichNav()}</>;
};

export default Navigation;

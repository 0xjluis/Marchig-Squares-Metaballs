function lookupTable(top: boolean, rgt: boolean, btn: boolean, lft: boolean) {
    const key = (top ? 8 : 0) + (rgt ? 4 : 0) + (btn ? 2 : 0) + (lft ? 1 : 0);
    let p1 = {x:null, y:null};
    let p2 = {x:null, y:null};

    switch (key) {
        case 3: // 0011
            //  false, false, true, true
            p1 = {x:0, y:0.5}
            p2 = {x:0.5, y:0};
            return {p1, p2};
            break;

        case 5: // 0101
            //  false, true, false, true
            p1 = {x:0, y:0.5}
            p2 = {x:1, y:0.5};
            return {p1, p2};
            break;

        case 6: // 0110
            //  false, true, true, false
            p1 = {x:1, y:0.5};
            p2 = {x:0.5, y:0};
            return {p1, p2};
            break;

        case 7: // 0111
            //  false, true, true, true
            p1 = {x:0, y:0.5}
            p2 = {x:1, y:0.5};
            return {p1, p2};
            break;

        case 9: // 1001
            //  true, false, false, true
            p1 = {x:0, y:0.5}
            p2 = {x:0.5, y:1};
            return {p1, p2};
            break;

        case 10: // 1010
            //  true, false, true, false
            p1 = {x:0.5, y:1}
            p2 = {x:0.5, y:0};
            return {p1, p2};
            break;

        case 12: // 1100
            //  true, true, false, false
            p1 = {x:0.5, y:1}
            p2 = {x:1, y:0.5};
            return {p1, p2};
            break;
        case 15: // 1111
            //  true, true, true, true !!! TODO 
            p1 = {x:null, y:null};
            p2 = {x:null, y:null};
            return {p1, p2};
            break;
        default:
            //console.log("noPirnt")
            return {p1, p2};
            break;
    }
}

export {
    lookupTable
}
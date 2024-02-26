import * as THREE from 'three';
import { lookupTable } from "./lookuptable"

const scene = new THREE.Scene();
const frustumSize = 12;

const heigth  = 500;
const width  = 500;
const aspect = width / heigth;
const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, 1000);

camera.position.set( 5, 5, 50 );
camera.lookAt( 5, 5, 10 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( heigth, width );
document.body.appendChild( renderer.domElement );


const gridSize = 10;
function createGid(){

    function createLine(points:THREE.Vector3[]){
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.Line( geometry, material );
        scene.add( line );
    }

    for(let i = 1; i< gridSize; i++){
        let points = [];
        points.push( new THREE.Vector3( i, -20, 0));
        points.push( new THREE.Vector3( i, 20, 0));
        createLine(points);
    }

    for(let i = 1; i< gridSize; i++){
        let points = [];
        points.push( new THREE.Vector3( -20, i, 0));
        points.push( new THREE.Vector3( 20, i, 0));
        createLine(points);
    }
}

function intersectionDot(){
    function createDot(position:THREE.Vector3){
        const geometry = new THREE.BoxGeometry( 0.15, 0.15, 0.2 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.set(position.x, position.y, position.z)
        scene.add( cube );
    }

    for(let i = 0; i <= gridSize; i++){
        for(let j = 0; j<= gridSize; j++){
            const position = new THREE.Vector3( j/1, i/1, 0);
            createDot(position);
        }
    }
}


let circles = []
function addCircle(circle:THREE.Line){
    circles.push(circle);
}

function clearCircles(){
    for(let i = 0; i < circles.length; i++){
        scene.remove(circles[i])
    }
}


function createCicle(){
    function createCirclePoints(radius:number, segments:number, positionInit:THREE.Vector3) {
        const points = [];
        for (let i = 0; i <= segments; i++) { 
            const theta = (i / segments) * Math.PI * 2; 
            const x = radius * Math.cos(theta)+ positionInit.x;
            const y = radius * Math.sin(theta)+ positionInit.y;

            points.push(new THREE.Vector3(x, y, 0)); 
        }
        return points;
    }

    const circleRadius = 2.35; 
    const segments = 20;
    const positionInit = new THREE.Vector3(3, 3, 0)
    const circlePoints = createCirclePoints(circleRadius, segments, positionInit);

    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const geometry = new THREE.BufferGeometry().setFromPoints(circlePoints);
    const circleLine = new THREE.Line(geometry, material);
    console.log(circleLine);
    addCircle(circleLine);

    scene.add(circleLine);
}

function getCirclePointsFromLine(circleLine) {
    const geometry = circleLine.geometry;
    const positionAttribute = geometry.attributes.position;
    const points = [];
    const transformedVector = new THREE.Vector3();
    for (let i = 0; i < positionAttribute.count; i++) {
        transformedVector.set(
            positionAttribute.getX(i),
            positionAttribute.getY(i),
            positionAttribute.getZ(i)
        );

        transformedVector.applyMatrix4(circleLine.matrixWorld);
        points.push(transformedVector.clone());
    }

    return points;
}

createCicle();
createGid();
intersectionDot();

let lineas = []
function printline(p1:number, p2:number, p3:number, p4:number ){

        let points = [];
        points.push( new THREE.Vector3( p1, p2, 0));
        points.push( new THREE.Vector3( p3, p4, 0));
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.Line( geometry, material);
        lineas.push(line);
        scene.add( line );
}

function clearLines(){
    for(let i = 0; i < lineas.length; i++){
        scene.remove(lineas[i])
    }
    lineas = [];
}

function interseccionSegmentos(p1, p2, p3, p4) {

    const s1_x = p2.x - p1.x;
    const s1_y = p2.y - p1.y;
    const s2_x = p4.x - p3.x;
    const s2_y = p4.y - p3.y;

    const s = (-s1_y * (p1.x - p3.x) + s1_x * (p1.y - p3.y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = ( s2_x * (p1.y - p3.y) - s2_y * (p1.x - p3.x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        const int_x = p1.x + (t * s1_x);
        const int_y = p1.y + (t * s1_y);
        return true;
    } else {
        return false;
    }
}

function findIntersection(segmentoPuntos, p3, p4) {
    for (let i = 0; i < segmentoPuntos.length - 1; i++) {
        const p1 = { x: segmentoPuntos[i].x, y: segmentoPuntos[i].y };
        const p2 = { x: segmentoPuntos[i + 1].x, y: segmentoPuntos[i + 1].y };

        if (interseccionSegmentos(p1, p2, p3, p4)) {
            return true;
        }
    }
    return false;
}

function parseGrid() {
    for (let i = 0; i < circles.length; i++) {
        const circlePoints = getCirclePointsFromLine(circles[i]);
        for (let x = 0; x <= gridSize; x++) {
            for (let y = 0; y <= gridSize; y++) {
                const btmLft = new THREE.Vector2(x, y);
                const btmRgt = new THREE.Vector2(x + 1, y);
                const topLft = new THREE.Vector2(x, y + 1);
                const topRgt = new THREE.Vector2(x + 1, y + 1);

                const top = findIntersection(circlePoints, topLft, topRgt);
                const rgt = findIntersection(circlePoints, btmRgt, topRgt);
                const btn = findIntersection(circlePoints, btmLft, btmRgt);
                const lft = findIntersection(circlePoints, btmLft, topLft);

                const { p1, p2 } = lookupTable(top, rgt, btn, lft);
                if (p1.x !== null) {
                    printline(p1.x + x, p1.y + y, p2.x + x, p2.y + y);
                }
            }
        }
    }
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    clearLines();
    circles[0].position.x += 0.01;
    circles[0].position.y += 0.012;
    parseGrid()
}

animate();


export{
    camera,
    renderer,
    scene
}
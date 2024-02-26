import * as THREE from 'three';
import { camera, renderer, scene } from "./main"

document.getElementById('moveUp').addEventListener('click', () => moveCamera(0, 1));
document.getElementById('moveDown').addEventListener('click', () => moveCamera(0, -1));
document.getElementById('moveLeft').addEventListener('click', () => moveCamera(-1, 0));
document.getElementById('moveRight').addEventListener('click', () => moveCamera(1, 0));
document.getElementById('zoomIn').addEventListener('click', () => zoomCamera(true));
document.getElementById('zoomOut').addEventListener('click', () => zoomCamera(false));
document.addEventListener('keydown', onDocumentKeyDown, false);

function moveCamera(x, y) {
    camera.position.x += x;
    camera.position.y += y;
    camera.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, 0));
    renderer.render(scene, camera);
}

function zoomCamera(zoomIn) {
    const zoomFactor = 0.1;
    if (zoomIn) {
        camera.zoom += zoomFactor;
    } else {
        camera.zoom -= zoomFactor;
    }
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87 || keyCode == 38) { // W o Arriba
        moveCamera(0, 1);
    } else if (keyCode == 83 || keyCode == 40) { // S  Abajo
        moveCamera(0, -1);
    } else if (keyCode == 65 || keyCode == 37) { // A Izquierda
        moveCamera(-1, 0);
    } else if (keyCode == 68 || keyCode == 39) { // D  Derecha
        moveCamera(1, 0);
    } else if (keyCode == 81) { // Q para acercar
        zoomCamera(true);
    } else if (keyCode == 69) { // E para alejar
        zoomCamera(false);
    }
}

let mouseX = 0;
let mouseY = 0;
function mousePostion(event:any) {
    const mouse = new THREE.Vector2();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouseX = (mouse.x * (camera.right - camera.left) / 2)+camera.position.x;
    mouseY = (mouse.y * (camera.top - camera.bottom) / 2)+camera.position.y

    console.log(mouseX,mouseY);
}
renderer.domElement.addEventListener('mousedown', mousePostion);


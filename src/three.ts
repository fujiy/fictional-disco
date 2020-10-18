import * as THREE from 'three'
import Stats from 'stats-js'

import { ThreeElement, ThreeObject } from './three/element'
import { ThreeCamera } from './three/camera'
import './three/element'
import './three/camera'
import './three/mesh'
import './three/geometry'
import './three/material'


class ThreeCanvas extends ThreeElement {
    renderer: THREE.WebGLRenderer

    constructor() {
        super()
        this.renderer = new THREE.WebGLRenderer()
    }
    static get observedAttributes(): string[] {
        return ['width', 'height']
    }
    attrChanged() {
        this.renderer.setSize(+this.getAttribute('width'),
            +this.getAttribute('height'))
    }
    get scene(): ThreeScene {
        return document.getElementById(this.getAttribute('scene-id')) as ThreeScene
    }
    add(_: ThreeObject) {
        // nothing to do
    }

    didConnect() {
        this.appendChild(this.renderer.domElement)

        var stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);

        const animate = () => {
            stats.begin();

            const scene = this.scene
            const camera = scene.camera

            this.renderer.render(scene.object3d, camera.object3d)

            stats.end();

            requestAnimationFrame(animate)
        };

        animate();

    }
}

class ThreeScene extends ThreeObject {
    object3d: THREE.Scene

    constructor() {
        super();
        this.object3d = new THREE.Scene();
    }
    static get observedAttributes(): string[] {
        return super.observedAttributes.concat(['camera-id', 'background'])
    }

    attrChanged(name: string, value: any) {
        switch (name) {
            case "background":
                this.object3d.background = new THREE.Color(value);
        }
    }

    get camera(): ThreeCamera {
        return document.getElementById(
            this.getAttribute('camera-id')) as ThreeCamera
    }
    // [...this.children].map(e => { this.object.add(e.object); });
}

customElements.define('three-canvas', ThreeCanvas);
customElements.define('three-scene', ThreeScene);

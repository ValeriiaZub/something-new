import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';

const ShaderScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const materialRef = useRef(null);
  const [color, setColor] = useState({ r: 0, g: 1, b: 0 });

  // Set up the scene once
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x222222, 1);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color.r, color.g, color.b) }
      },
      vertexShader,
      fragmentShader
    });
    materialRef.current = material;

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    sceneRef.current = { scene, camera, renderer, cube };

    camera.position.z = 5;

    const animate = function () {
      if (!mountRef.current) return;
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []); // Empty dependency array - only run once

  // Update color uniform when color changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.set(color.r, color.g, color.b);
    }
  }, [color]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (sceneRef.current) {
        const { camera, renderer } = sceneRef.current;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={mountRef}>
      <div>
        <div>
          <label style={{ color: 'white', marginRight: '10px' }}>Red:</label>
          <input type="range" min="0" max="1" step="0.01" value={color.r} 
            onChange={(e) => setColor({ ...color, r: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label style={{ color: 'white', marginRight: '10px' }}>Green:</label>
          <input type="range" min="0" max="1" step="0.01" value={color.g} 
            onChange={(e) => setColor({ ...color, g: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label style={{ color: 'white', marginRight: '10px' }}>Blue:</label>
          <input type="range" min="0" max="1" step="0.01" value={color.b} 
            onChange={(e) => setColor({ ...color, b: parseFloat(e.target.value) })} />
        </div>
      </div>
    </div>
  );
};

export default ShaderScene; 
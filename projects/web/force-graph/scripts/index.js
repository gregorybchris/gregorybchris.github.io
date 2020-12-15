const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true);

const updateEdge = (edge, nodeA, nodeB) => {
  edge.position = nodeA.position.add(nodeB.position).scale(0.5);
  edge.lookAt(nodeA.position, 0, Math.PI / 2);
  edge.scaling.y = BABYLON.Vector3.Distance(nodeA.position, nodeB.position) / 2;
};

const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 3, -15), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.keysUp.push(87); // W
  camera.keysDown.push(83); // D
  camera.keysLeft.push(65); // A
  camera.keysRight.push(68); // S
  camera.attachControl(canvas, true);

  // Environment

  const light = new BABYLON.PointLight("light", new BABYLON.Vector3(1, 20, 1), scene);
  light.intensity = 0.7;

  const shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
  shadowGenerator.usePoissonSampling = true;

  scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
  ground.receiveShadows = true;

  // Graph

  const nodes = [];
  for (let i = 0; i < 10; i++) {
    let newNode = BABYLON.MeshBuilder.CreateSphere(`newNode${i}`, { diameter: 1, segments: 32 }, scene);
    nodes.push(newNode);
    let x = (Math.random() - 0.5) * 8;
    let y = (Math.random() - 0.5) * 8 + 5;
    let z = (Math.random() - 0.5) * 8;
    newNode.position = new BABYLON.Vector3(x, y, z);
    shadowGenerator.getShadowMap().renderList.push(newNode);
  }

  const edges = [];
  nodes.forEach((nodeA) => {
    nodes.forEach((nodeB) => {
      if (Math.random() > 0.8) {
        let newEdge = BABYLON.MeshBuilder.CreateCylinder(`newEdge`, { diameter: 0.3 }, scene);
        edges.push([newEdge, nodeA, nodeB]);
        shadowGenerator.getShadowMap().renderList.push(newEdge);
      }
    });
  });

  scene.registerBeforeRender(() => {
    edges.forEach((edgeSet, i) => {
      const st = Math.sin(performance.now() / 900 + i);
      const ct = Math.cos(performance.now() / 900 + i);
      let [edge, nodeA, nodeB] = edgeSet;
      nodeA.position.x += ct / 100;
      nodeA.position.y += st / 100;
      nodeA.position.z += (st * ct) / 100;
      updateEdge(edge, nodeA, nodeB);
    });
  });

  return scene;
};

const scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});

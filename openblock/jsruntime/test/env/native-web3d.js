
OpenBlock.Env.registerNativeTypes(['web3d'], {
    'THREE.Object3D': [],
    'THREE.Vector3': [],

    'THREE.BufferGeometry': [],
    'THREE.BoxGeometry': ['THREE.BufferGeometry'],
    'THREE.CircleGeometry': ['THREE.BufferGeometry'],
    'THREE.ConeGeometry': ['THREE.BufferGeometry'],
    'THREE.CylinderGeometry': ['THREE.BufferGeometry'],
    'THREE.DodecahedronGeometry': ['THREE.BufferGeometry'],
    'THREE.EdgesGeometry': ['THREE.BufferGeometry'],
    'THREE.ExtrudeGeometry': ['THREE.BufferGeometry'],
    'THREE.BoxGeometry': ['THREE.BufferGeometry'],
    'THREE.IcosahedronGeometry': ['THREE.BufferGeometry'],
    'THREE.LatheGeometry': ['THREE.BufferGeometry'],
    'THREE.OctahedronGeometry': ['THREE.BufferGeometry'],
    'THREE.PlaneGeometry': ['THREE.BufferGeometry'],
    'THREE.PolyhedronGeometry': ['THREE.BufferGeometry'],
    'THREE.RingGeometry': ['THREE.BufferGeometry'],
    'THREE.ShapeGeometry': ['THREE.BufferGeometry'],
    'THREE.TetrahedronGeometry': ['THREE.BufferGeometry'],
    'THREE.TorusGeometry': ['THREE.BufferGeometry'],
    'TorusKnotGeometry': ['THREE.BufferGeometry'],
    'THREE.TubeGeometry': ['THREE.BufferGeometry'],
    'THREE.WireframeGeometry': ['THREE.BufferGeometry'],


    'THREE.Mesh': ['THREE.Object3D'],
    'THREE.Material': [],
    'THREE.MeshStandardMaterial': ['THREE.Material']
});
OpenBlock.Env.registerEvents(['web3d'], '', [
    { "name": "click", "argType": "THREE.Vector3" },
    { "name": "touchstart", "argType": "THREE.Vector3" },
    { "name": "touchmove", "argType": "THREE.Vector3" },
    { "name": "touchcancel", "argType": "THREE.Vector3" },
    { "name": "touchend", "argType": "THREE.Vector3" },
    { "name": "mousemove", "argType": "THREE.Vector3" },
    { "name": "longpress", "argType": "THREE.Vector3" },
    { "name": "swipe" },
    { "name": "windowResize" },
    { "name": "keydown", "argType": "String" },
    { "name": "keyup", "argType": "String" },
]);
OpenBlock.Env.registerNativeFunction(['web3d'], 'three.js', 'three.js', [
    {
        method_name: 'THREE.Object3D_get_position', arguments: [
            { type: 'THREE.Object3D', name: 'object' }
        ], returnType: 'THREE.Vector3'
    },
    {
        method_name: 'THREE.Vector3_set_x', arguments: [
            { type: 'THREE.Vector3', name: 'object' },
            { type: 'Number', name: 'x' },
        ], returnType: 'void'
    },
    {
        method_name: 'THREE.Vector3_set_y', arguments: [
            { type: 'THREE.Vector3', name: 'object' },
            { type: 'Number', name: 'y' },
        ], returnType: 'void'
    },
    {
        method_name: 'THREE.Vector3_set_z', arguments: [
            { type: 'THREE.Vector3', name: 'object' },
            { type: 'Number', name: 'z' },
        ], returnType: 'void'
    },
    {
        method_name: 'THREE.BoxGeometry_new', arguments: [
        ], returnType: 'THREE.BoxGeometry'
    },

 
    {
        method_name: 'THREE.CircleGeometry_new', arguments: [
        ], returnType: 'THREE.CircleGeometry'
    },
    {
        method_name: 'THREE.ConeGeometry_new', arguments: [
        ], returnType: 'THREE.ConeGeometry'
    },
    {
        method_name: 'THREE.CylinderGeometry_new', arguments: [
        ], returnType: 'THREE.CylinderGeometry'
    },
    {
        method_name: 'THREE.DodecahedronGeometry_new', arguments: [
        ], returnType: 'THREE.DodecahedronGeometry'
    },
    {
        method_name: 'THREE.EdgesGeometry_new', arguments: [
        ], returnType: 'THREE.EdgesGeometry'
    },
    {
        method_name: 'THREE.ExtrudeGeometry_new', arguments: [
        ], returnType: 'THREE.ExtrudeGeometry'
    },
    {
        method_name: 'THREE.IcosahedronGeometry_new', arguments: [
        ], returnType: 'THREE.IcosahedronGeometry'
    },
    {
        method_name: 'THREE.LatheGeometry_new', arguments: [
        ], returnType: 'THREE.LatheGeometry'
    },
    {
        method_name: 'THREE.OctahedronGeometry_new', arguments: [
        ], returnType: 'THREE.OctahedronGeometry'
    },
    {
        method_name: 'THREE.PlaneGeometry_new', arguments: [
        ], returnType: 'THREE.PlaneGeometry'
    },
    {
        method_name: 'THREE.PolyhedronGeometry_new', arguments: [
        ], returnType: 'THREE.PolyhedronGeometry'
    },
    {
        method_name: 'THREE.RingGeometry_new', arguments: [
        ], returnType: 'THREE.RingGeometry'
    },
    {
        method_name: 'THREE.ShapeGeometry_new', arguments: [
        ], returnType: 'THREE.ShapeGeometry'
    },
    {
        method_name: 'THREE.SphereGeometry_new', arguments: [
        ], returnType: 'THREE.SphereGeometry'
    },
    {
        method_name: 'THREE.TetrahedronGeometry_new', arguments: [
        ], returnType: 'THREE.TetrahedronGeometry'
    },
    {
        method_name: 'THREE.TorusGeometry_new', arguments: [
        ], returnType: 'THREE.TorusGeometry'
    },
    {
        method_name: 'THREE.TorusKnotGeometry_new', arguments: [
        ], returnType: 'THREE.TorusKnotGeometry'
    },
    {
        method_name: 'THREE.TubeGeometry_new', arguments: [
        ], returnType: 'THREE.TubeGeometry'
    },
    {
        method_name: 'THREE.WireframeGeometry_new', arguments: [
        ], returnType: 'THREE.WireframeGeometry'
    },






    {
        method_name: 'THREE.Scene_add', arguments: [
            { type: 'THREE.Object3D', name: 'object' },
        ], returnType: 'void'
    },
    {
        method_name: 'THREE.Mesh_new', arguments: [
            { type: 'THREE.BufferGeometry', name: 'geometry' },
            { type: 'THREE.Material', name: 'material' },
        ], returnType: 'THREE.Mesh'
    },
    {
        method_name: 'THREE.MeshStandardMaterial_new', arguments: [
            { type: 'Colour', name: 'color' },
        ], returnType: 'THREE.MeshStandardMaterial'
    },
    {
        method_name: 'THREE.build_box_at', arguments: [
            { type: 'Colour', name: 'color' },
            { type: 'Number', name: 'x' },
            { type: 'Number', name: 'y' },
            { type: 'Number', name: 'z' },
        ], returnType: 'THREE.Mesh'
    },
    {
        method_name: 'THREE.Mesh_set_color', arguments: [
            { type: 'THREE.Mesh', name: 'mesh' },
            { type: 'Colour', name: 'color' },
        ], returnType: 'void'
    },
    {
        method_name: 'THREE.Mesh_set_scale', arguments: [
            { type: 'THREE.Mesh', name: 'mesh' },
            { type: 'Number', name: 'x' },
            { type: 'Number', name: 'y' },
            { type: 'Number', name: 'z' },
        ], returnType: 'void'
    },
    {
        method_name: 'THREE.build_box_at_v3', arguments: [
            { type: 'Colour', name: 'color' },
            { type: 'THREE.Vector3', name: 'position' },
        ], returnType: 'THREE.Mesh'
    },
    {
        method_name: 'THREE.Vector3_get_x', arguments: [
            { type: 'THREE.Vector3', name: 'position' },
        ], returnType: 'Number'
    },
    {
        method_name: 'THREE.Vector3_get_y', arguments: [
            { type: 'THREE.Vector3', name: 'position' },
        ], returnType: 'Number'
    },
    {
        method_name: 'THREE.Vector3_get_z', arguments: [
            { type: 'THREE.Vector3', name: 'position' },
        ], returnType: 'Number'
    },
    {
        method_name: 'THREE.Scene_remove', arguments: [
            { type: 'THREE.Object3D', name: 'object' },
        ], returnType: 'void'
    },
    {
        method_name: 'THREE.Mesh_set_opacity', arguments: [
            { type: 'THREE.Mesh', name: 'mesh' },
            { type: 'Number', name: 'opacity' },
        ], returnType: 'void'
    },
    {
        method_name: 'THREE.Mesh_get_opacity', arguments: [
            { type: 'THREE.Mesh', name: 'mesh' },
        ], returnType: 'void'
    },
]);
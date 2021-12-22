import React, { useEffect } from 'react'

import ForceGraph3D from 'react-force-graph-3d'

function ConnectedNodeMap(props) {

    const { data } = props

    const imgs = ['cat.jpg', 'dog.jpg', 'eagle.jpg', 'elephant.jpg', 'grasshopper.jpg', 'octopus.jpg', 'owl.jpg', 'panda.jpg', 'squirrel.jpg', 'tiger.jpg', 'whale.jpg'];

    // Random connected graph
    const gData = {
        nodes: imgs.map((img, id) => ({ id, img })),
        links: [...Array(imgs.length).keys()]
            .filter(id => id)
            .map(id => ({
                source: id,
                target: Math.round(Math.random() * (id - 1))
            }))
    };


    const nodes = [];

    data.forEach(item => {
        nodes.push(item.organization)
        item.members.forEach(e => nodes.push(e))
    })

    const links = [];

    data.forEach(item => {
        let source = item.organization.cin;
        item.members.forEach(e => {
            if (e.din && source) {

                links.push({ target: e.din, source })
            }
        })
    })


    const testGData = {
        nodes: nodes.map(({ din, cin, name }) => ({ id: din ?? cin, name })),
        links: [...links]
    }


    console.log(gData);
    useEffect(() => {
        // console.log('test links', links)
        console.log('test', testGData)
        console.log('gData', gData)
    }, [])
    return (
        <div>
            <ForceGraph3D
                graphData={testGData}
            // nodeThreeObject={}
            // nodeThreeObject={({ img }) => {
            //     const imgTexture = new THREE.TextureLoader().load(`./imgs/${img}`);
            //     const material = new THREE.SpriteMaterial({ map: imgTexture });
            //     const sprite = new THREE.Sprite(material);
            //     sprite.scale.set(12, 12);

            //     return sprite;
            // }}
            />,
        </div>
    )
}

export default ConnectedNodeMap

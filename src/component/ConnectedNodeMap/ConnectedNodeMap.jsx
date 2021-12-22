import React from 'react'


import ForceGraph2D from 'react-force-graph-2d'


import companyIcon from '../../assets/img/company.png'
import userIcon from '../../assets/img/user-male.png'

function ConnectedNodeMap(props) {

    const { data } = props


    const nodes = [];

    const isAddedNodes = [];
    data.forEach(item => {
        nodes.push({ ...item.organization, icon: 'companyIcon' })

        item.members.forEach(e => {
            if (!isAddedNodes.includes(e.din)) {
                nodes.push({ ...e, icon: 'userIcon' })

            }

            isAddedNodes.push(e.din)
        })
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


    const graphData = {
        nodes: nodes.map(({ din, cin, name, icon }) => ({ id: din ?? cin, name, icon })),
        links: [...links]
    }




    return (
        <div>

            <ForceGraph2D
                graphData={graphData}
                nodeLabel=""
                nodeColor="white"
                nodeAutoColorBy="#fff"
                nodeCanvasObjectMode={() => "after"}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize =8 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "black"; //node.color;
                    ctx.fillText(label, node.x, node.y + 10);

                    const size = 15;
                    const img = new Image();

                    const src = node.icon === "companyIcon" ? companyIcon : userIcon;

                    img.src = src;
                    ctx.drawImage(img,
                        node.x - size / 2 + 0,
                        node.y - size / 2 + 1,
                        size + 1,
                        size - 1
                    )
                    return ctx
                }}
                minZoom={2}
                linkWidth={2}
            // autoPauseRedraw={false}

            // nodeCanvasObject={(node, ctx) => nodePaint(node, getColor(node.id), ctx)}
            // nodePointerAreaPaint={nodePaint}
            />
        </div>
    )
}

export default ConnectedNodeMap

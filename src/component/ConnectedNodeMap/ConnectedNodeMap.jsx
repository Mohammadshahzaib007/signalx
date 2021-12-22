import React from 'react'


import ForceGraph2D from 'react-force-graph-2d'


import companyIcon from '../../assets/img/company.png'
import userIcon from '../../assets/img/user-male.png'

function ConnectedNodeMap(props) {

    const { data } = props


    const nodes = [];

    const isAddedNodes = [];
    data.forEach(item => {
        nodes.push({ ...item.organization, icon: companyIcon })

        item.members.forEach(e => {
            if (!isAddedNodes.includes(e.din)) {
                nodes.push({ ...e, icon: userIcon })

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
        nodes: nodes.map(({ din, cin, name }) => ({ id: din ?? cin, name })),
        links: [...links]
    }




    return (
        <div>

            <ForceGraph2D
                graphData={graphData}
                nodeLabel=""
                nodeCanvasObjectMode={() => "after"}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 10 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "black"; //node.color;
                    ctx.fillText(label, node.x, node.y + 8);
                }}
                minZoom={3}
                linkWidth={2}
            // autoPauseRedraw={false}

            // nodeCanvasObject={(node, ctx) => nodePaint(node, getColor(node.id), ctx)}
            // nodePointerAreaPaint={nodePaint}
            />
        </div>
    )
}

export default ConnectedNodeMap

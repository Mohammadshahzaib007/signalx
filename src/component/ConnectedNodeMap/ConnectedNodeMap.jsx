import React from 'react'


import ForceGraph2D from 'react-force-graph-2d'

function ConnectedNodeMap(props) {

    const { data } = props


    const nodes = [];

    const isAddedNodes = [];
    data.forEach(item => {
        nodes.push(item.organization)

        item.members.forEach(e => {
            if (!isAddedNodes.includes(e.din)) {
                nodes.push(e)

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


    const testGData = {
        nodes: nodes.map(({ din, cin, name }) => ({ id: din ?? cin, name })),
        links: [...links]
    }



    return (
        <div>

            <ForceGraph2D
                graphData={testGData}
                nodeLabel="name"
            // nodeCanvasObject={(node, ctx) => nodePaint(node, getColor(node.id), ctx)}
            // nodePointerAreaPaint={nodePaint}
            />
        </div>
    )
}

export default ConnectedNodeMap

import React, { useState, useMemo } from 'react'


import ForceGraph2D from 'react-force-graph-2d'


import companyIcon from '../../assets/img/company.png'
import userIcon from '../../assets/img/user-male.png'

function ConnectedNodeMap(props) {

    const { data } = props


    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [clickedNode, setClickedNode] = useState(null);

    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };

    const handleNodeHighlight = node => {
        if (node.id === clickedNode?.id) {
            setClickedNode(null)
            highlightNodes.clear();
            highlightLinks.clear();
            return
        }
        if (node) {
            highlightNodes.add(node);
            node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
            node.links.forEach(link => highlightLinks.add(link));
        }

        setClickedNode(node || null);
        updateHighlight();
    };



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

    const dataWithNeighbors = useMemo(() => {


        // cross-link node objects
        graphData.links.forEach(link => {
            const a = graphData.nodes.find(item => item.id === link.source);
            const b = graphData.nodes.find(item => item.id === link.target);
            !a.neighbors && (a.neighbors = []);
            !b.neighbors && (b.neighbors = []);
            a.neighbors.push(b);
            b.neighbors.push(a);


            !a.links && (a.links = []);
            !b.links && (b.links = []);
            a.links.push(link);
            b.links.push(link);
        });

        return graphData;
    }, []);




    return (
        <div>

            <ForceGraph2D
                graphData={dataWithNeighbors}
                nodeLabel=""
                height={620}
                backgroundColor='#eee'
                nodeColor="transparent"
                nodeAutoColorBy="#fff"
                linkWidth={link => highlightLinks.has(link) ? 2 : 1}

                nodeCanvasObjectMode={() => "after"}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 8 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = highlightNodes.has(node) ? "red" : "black"; //node.color;
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
                linkColor={(link) => (highlightLinks.has(link) ? "red" : "#444")}
                minZoom={2}
                onNodeClick={handleNodeHighlight}
            />
        </div>
    )
}

export default ConnectedNodeMap

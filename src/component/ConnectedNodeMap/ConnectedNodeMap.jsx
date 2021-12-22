import React, { useState, useMemo } from 'react'


import ForceGraph2D from 'react-force-graph-2d'


import companyIcon from '../../assets/img/company.png'
import userIcon from '../../assets/img/user-male.png'

function ConnectedNodeMap(props) {

    const { data } = props


    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [hoverNode, setHoverNode] = useState(null);

    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };

    const handleNodeHover = node => {
        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
            highlightNodes.add(node);
            node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
            node.links.forEach(link => highlightLinks.add(link));
        }

        setHoverNode(node || null);
        updateHighlight();
    };

    const handleLinkHover = link => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
        }

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
                nodeColor="transparent"
                nodeAutoColorBy="#fff"
                linkWidth={link => highlightLinks.has(link) ? 5 : 1}
                linkDirectionalParticles={4}
                linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}

                nodeCanvasObjectMode={() => "after"}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 8 / globalScale;
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
                onNodeHover={handleNodeHover}
                onLinkHover={handleLinkHover}
            />
        </div>
    )
}

export default ConnectedNodeMap

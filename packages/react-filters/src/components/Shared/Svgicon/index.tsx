interface Props {
  icon: string
}

const style: React.CSSProperties = { width: "14px", height: "14px", display: "block", fill: "rgb(202, 204, 206)", flexShrink: 0, backfaceVisibility: "hidden", marginRight: "8px" };

export default function Svgicon(props: Props) {
  switch (props.icon) {
    case "remove":
      return <svg viewBox="0 0 30 30" style={style}><path d="M21,5c0-2.2-1.8-4-4-4h-4c-2.2,0-4,1.8-4,4H2v2h2v22h22V7h2V5H21z M13,3h4c1.104,0,2,0.897,2,2h-8C11,3.897,11.897,3,13,3zM24,27H6V7h18V27z M16,11h-2v12h2V11z M20,11h-2v12h2V11z M12,11h-2v12h2V11z"></path></svg>
    case "duplicate":
      return <svg viewBox="0 0 30 30" style={style}><path d="M1,29h20V9H1V29z M3,11h16v16H3V11z M9,1v6h2V3h16v16h-4v2h6V1H9z"></path></svg>
    case "elipsis":
      return <svg viewBox="0 0 13 3" style={style}><g> <path d="M3,1.5A1.5,1.5,0,1,1,1.5,0,1.5,1.5,0,0,1,3,1.5Z"></path> <path d="M8,1.5A1.5,1.5,0,1,1,6.5,0,1.5,1.5,0,0,1,8,1.5Z"></path> <path d="M13,1.5A1.5,1.5,0,1,1,11.5,0,1.5,1.5,0,0,1,13,1.5Z"></path> </g></svg>
    default:
      return <span></span>
  }
}
import React from "react";

export default function CollectionsBar({
  collections,
  activeCollection,
  setActiveCollection,
  onCollectionChange
}) {
  const selectCollection = (colName) => {
    setActiveCollection(colName);
    if (onCollectionChange) {
      onCollectionChange(colName);
    }
  };

  // Styles, images, and text inside/below category circles
  const getCategoryCircleStyles = (col) => {
    // If col is a legacy string, fallback, but we've upgraded collections to objects
    const name = col.name || col;
    const image = col.thumbnail || col.image || null;
    const text = col.circleText || name.toUpperCase();
    const textColor = col.circleTextColor || "#FFFFFF";
    
    // As per user request: collection name bold, category name small/light below it
    const title = col.collectionName ? col.collectionName.toUpperCase() : name.toUpperCase();
    const subtext = col.collectionName ? name : (col.subtext || null);

    return {
      bg: name === "All" ? "#0D0D0D" : "#cccccc",
      image,
      text,
      textColor,
      title,
      subtext
    };
  };

  return (
    <>
      <style>{`
        .col-bar-wrapper {
          background: #ffffff;
          padding: 1.5rem 1.25rem 1rem;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          position: sticky;
          top: 70px;
          z-index: 150;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
          box-sizing: border-box;
        }
        .col-circle-list {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scrollbar-width: none;
          flex: 1;
          padding: 0.25rem 0;
        }
        .col-circle-list::-webkit-scrollbar {
          display: none;
        }
        .col-circle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
          width: 76px;
          cursor: pointer;
          border: none;
          background: transparent;
          padding: 0;
        }
        .col-circle {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: var(--transition-smooth);
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
        }
        .col-circle-item.active .col-circle {
          border-color: var(--black);
          transform: scale(1.04);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .col-circle-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .col-circle-text {
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 800;
          z-index: 2;
          letter-spacing: 0.02em;
          text-align: center;
          padding: 0 6px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.6);
        }
        .col-circle-label-title {
          font-family: var(--font-heading);
          font-size: 10.5px;
          font-weight: 800;
          color: #000000;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.2;
        }
        .col-circle-label-sub {
          font-family: var(--font-body);
          font-size: 9px;
          font-weight: 400;
          color: #999999;
          text-align: center;
          margin-top: 1px;
        }
        .col-circle-item.active .col-circle-label-title {
          font-weight: 900;
        }
      `}</style>

      <div className="col-bar-wrapper">
        <div className="col-circle-list">
          {collections.map((col) => {
            const name = col.name || col;
            const filterValue = col.collectionName || name;
            const styles = getCategoryCircleStyles(col);
            const isActive = activeCollection === filterValue;
            return (
              <button
                key={name}
                onClick={() => selectCollection(filterValue)}
                className={`col-circle-item ${isActive ? "active" : ""}`}
              >
                <div
                  className="col-circle"
                  style={{
                    backgroundColor: name === "All" ? "var(--black)" : "var(--gray)"
                  }}
                >
                  {styles.image && (
                    <img src={styles.image} alt={name} className="col-circle-img" style={{ filter: "none" }} />
                  )}
                  {name === "All" && (
                    <span
                      className="col-circle-text"
                      style={{ color: "#FFFFFF" }}
                    >
                      ALL
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span className="col-circle-label-title">{styles.title}</span>
                  {styles.subtext && (
                    <span className="col-circle-label-sub">{styles.subtext}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

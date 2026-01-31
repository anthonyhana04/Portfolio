import React from 'react';

export const TerminalIcon = ({ className = "", width = 50, height = 50 }) => (
    <svg
        className={`terminal-svg ${className}`}
        width={width}
        height={height}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="40" height="40" fill="white" fillOpacity="0" />
        <rect x="3.875" y="4.875" width="34.625" height="34.625" className="fill-current stroke-current" />
        <rect x="1.5" y="2.5" width="34.625" height="34.625" fill="white" className="stroke-current" />
        <rect x="35.4375" y="2" width="1.1875" height="1.1875" fill="white" />
        <rect x="34.4941" y="35.5" width="1.1875" height="1.1875" className="fill-current" />
        <rect x="1" y="2" width="1.1875" height="1.1875" fill="white" />
        <rect x="1" y="36.4375" width="1.1875" height="1.1875" fill="white" />
        <rect x="3.375" y="38.8125" width="1.1875" height="1.1875" fill="white" />
        <rect x="37.8125" y="38.8125" width="1.1875" height="1.1875" fill="white" />
        <rect x="37.8125" y="4.375" width="1.1875" height="1.1875" fill="white" />
        <rect x="15.8213" y="26.2188" width="12.3845" height="1.25" className="fill-current" />
        <rect x="19.415" y="17.5156" width="1.25" height="1.8911" transform="rotate(90 19.415 17.5156)" className="fill-current" />
        <rect x="18.0645" y="16.6211" width="1.25" height="1.8911" transform="rotate(90 18.0645 16.6211)" className="fill-current" />
        <rect x="16.7129" y="15.7266" width="1.25" height="1.8911" transform="rotate(90 16.7129 15.7266)" className="fill-current" />
        <rect x="15.3623" y="14.8359" width="1.25" height="1.8911" transform="rotate(90 15.3623 14.8359)" className="fill-current" />
        <rect x="15.3623" y="20.1953" width="1.25" height="1.8911" transform="rotate(90 15.3623 20.1953)" className="fill-current" />
        <rect x="14.0107" y="21.0859" width="1.25" height="1.8911" transform="rotate(90 14.0107 21.0859)" className="fill-current" />
        <rect x="12.6602" y="21.9805" width="1.25" height="1.8911" transform="rotate(90 12.6602 21.9805)" className="fill-current" />
        <rect x="14.0107" y="13.9414" width="1.25" height="1.8911" transform="rotate(90 14.0107 13.9414)" className="fill-current" />
        <rect x="12.6602" y="13.0508" width="1.25" height="1.8911" transform="rotate(90 12.6602 13.0508)" className="fill-current" />
        <rect x="11.3086" y="12.1562" width="1.25" height="1.8911" transform="rotate(90 11.3086 12.1562)" className="fill-current" />
        <rect x="11.3086" y="22.8711" width="1.25" height="1.8911" transform="rotate(90 11.3086 22.8711)" className="fill-current" />
        <rect x="16.7129" y="19.3008" width="1.25" height="1.8911" transform="rotate(90 16.7129 19.3008)" className="fill-current" />
        <rect x="18.0645" y="18.4062" width="1.25" height="1.8911" transform="rotate(90 18.0645 18.4062)" className="fill-current" />
    </svg>
);

export const AirplaneIcon = ({ className = "", width = 50, height = 50, isHovered = false }) => (
    <svg
        className={`airplane-svg transition-all duration-300 ${className} ${isHovered ? 'drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] text-red-500' : ''}`}
        width={width}
        height={height}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="40" height="40" fill="white" fillOpacity="0"></rect>
        <rect y="38.75" width="40" height="1.25" className="fill-current"></rect>
        <rect x="5.45117" y="37.5" width="30.7988" height="1.25" className="fill-current"></rect>
        <rect x="10.9111" y="36.25" width="22.0322" height="1.25" className="fill-current"></rect>
        <rect x="26.25" y="10" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="27.5" y="10" width="2.5" height="1.25" className="fill-current"></rect>
        <rect x="37.5" y="11.25" width="2.5" height="1.25" className="fill-current"></rect>
        <rect x="38.75" y="12.5" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="30" y="8.75" width="5" height="1.25" className="fill-current"></rect>
        <rect x="35" y="10" width="2.5" height="1.25" className="fill-current"></rect>
        <rect x="37.5" y="13.75" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="36.25" y="13.75" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="32.5" y="15" width="3.75" height="1.25" className="fill-current"></rect>
        <rect x="28.75" y="16.25" width="3.75" height="1.25" className="fill-current"></rect>
        <rect x="25" y="17.5" width="3.75" height="1.25" className="fill-current"></rect>
        <rect x="21.25" y="18.75" width="3.75" height="1.25" className="fill-current"></rect>
        <rect x="17.5" y="20" width="3.75" height="1.25" className="fill-current"></rect>
        <rect x="13.75" y="21.25" width="3.75" height="1.25" className="fill-current"></rect>
        <rect x="10" y="22.5" width="2.5" height="1.25" className="fill-current"></rect>
        <rect x="12.5" y="22.5" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="7.5" y="20" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="8.75" y="21.25" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="6.25" y="18.75" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="11.25" y="16.25" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="10" y="16.25" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="15" y="15" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="12.5" y="16.25" width="2.5" height="1.25" className="fill-current"></rect>
        <rect x="16.25" y="12.5" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="16.25" y="13.75" width="1.25" height="1.25" className="fill-current"></rect>
        <rect x="15" y="11.25" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="8.75" y="15" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="7.5" y="13.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="6.25" y="13.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="3.75" y="12.5" width="2.5" height="1.25" class="fill-current"></rect>
        <rect x="2.5" y="15" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="1.25" y="13.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect y="12.5" width="2.5" height="1.25" class="fill-current"></rect>
        <rect x="5" y="17.5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="3.75" y="16.25" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="2.5" y="12.5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="20" y="10" width="2.5" height="1.25" class="fill-current"></rect>
        <rect x="18.75" y="8.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="21.25" y="16.25" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="23.75" y="16.25" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="22.5" y="17.5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="26.25" y="16.25" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="27.5" y="15" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="28.75" y="13.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="30" y="15" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="31.25" y="13.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="33.75" y="13.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="35" y="12.5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="32.5" y="12.5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="37.5" y="12.5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="36.25" y="11.25" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="25" y="15" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="20" y="17.5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="18.75" y="18.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="17.5" y="17.5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="16.25" y="18.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="15" y="20" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="13.75" y="18.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="12.5" y="20" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="10" y="20" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="11.25" y="21.25" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="17.5" y="7.5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="11.25" y="7.5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="10" y="6.25" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="10" y="5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="8.75" y="5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="11.25" y="5" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="15" y="6.25" width="2.5" height="1.25" class="fill-current"></rect>
        <rect x="12.5" y="5" width="2.5" height="1.25" class="fill-current"></rect>
        <rect x="13.75" y="10" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="12.5" y="8.75" width="1.25" height="1.25" class="fill-current"></rect>
        <rect x="22.5" y="11.25" width="2.5" height="1.25" class="fill-current"></rect>
        <rect x="25" y="11.25" width="1.25" height="1.25" class="fill-current"></rect>
    </svg>
);

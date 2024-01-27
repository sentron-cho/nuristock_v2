export const Logo = ({
	className = '',
	onClick,
}: {
	className?: string;
	onClick?: () => void;
}) => {
	return (
		// <svg
		// 	width='118'
		// 	height='21'
		// 	viewBox='0 0 118 21'
		// 	fill='none'
		// 	xmlns='http://www.w3.org/2000/svg'
		// 	className={className}
		// 	onClick={onClick}
		// >
		// 	<path
		// 		d='M0.672 13.28C0.672 11.904 0.928 10.696 1.44 9.656C1.968 8.616 2.68 7.816 3.576 7.256C4.472 6.696 5.472 6.416 6.576 6.416C7.52 6.416 8.344 6.608 9.048 6.992C9.768 7.376 10.32 7.88 10.704 8.504V6.608H14.808V20H10.704V18.104C10.304 18.728 9.744 19.232 9.024 19.616C8.32 20 7.496 20.192 6.552 20.192C5.464 20.192 4.472 19.912 3.576 19.352C2.68 18.776 1.968 17.968 1.44 16.928C0.928 15.872 0.672 14.656 0.672 13.28ZM10.704 13.304C10.704 12.28 10.416 11.472 9.84 10.88C9.28 10.288 8.592 9.992 7.776 9.992C6.96 9.992 6.264 10.288 5.688 10.88C5.128 11.456 4.848 12.256 4.848 13.28C4.848 14.304 5.128 15.12 5.688 15.728C6.264 16.32 6.96 16.616 7.776 16.616C8.592 16.616 9.28 16.32 9.84 15.728C10.416 15.136 10.704 14.328 10.704 13.304ZM16.9611 13.28C16.9611 11.904 17.2171 10.696 17.7291 9.656C18.2571 8.616 18.9691 7.816 19.8651 7.256C20.7611 6.696 21.7611 6.416 22.8651 6.416C23.7451 6.416 24.5451 6.6 25.2651 6.968C26.0011 7.336 26.5771 7.832 26.9931 8.456V2.24H31.0971V20H26.9931V18.08C26.6091 18.72 26.0571 19.232 25.3371 19.616C24.6331 20 23.8091 20.192 22.8651 20.192C21.7611 20.192 20.7611 19.912 19.8651 19.352C18.9691 18.776 18.2571 17.968 17.7291 16.928C17.2171 15.872 16.9611 14.656 16.9611 13.28ZM26.9931 13.304C26.9931 12.28 26.7051 11.472 26.1291 10.88C25.5691 10.288 24.8811 9.992 24.0651 9.992C23.2491 9.992 22.5531 10.288 21.9771 10.88C21.4171 11.456 21.1371 12.256 21.1371 13.28C21.1371 14.304 21.4171 15.12 21.9771 15.728C22.5531 16.32 23.2491 16.616 24.0651 16.616C24.8811 16.616 25.5691 16.32 26.1291 15.728C26.7051 15.136 26.9931 14.328 26.9931 13.304ZM51.1541 6.464C52.8181 6.464 54.1381 6.968 55.1141 7.976C56.1061 8.984 56.6021 10.384 56.6021 12.176V20H52.5221V12.728C52.5221 11.864 52.2901 11.2 51.8261 10.736C51.3781 10.256 50.7541 10.016 49.9541 10.016C49.1541 10.016 48.5221 10.256 48.0581 10.736C47.6101 11.2 47.3861 11.864 47.3861 12.728V20H43.3061V12.728C43.3061 11.864 43.0741 11.2 42.6101 10.736C42.1621 10.256 41.5381 10.016 40.7381 10.016C39.9381 10.016 39.3061 10.256 38.8421 10.736C38.3941 11.2 38.1701 11.864 38.1701 12.728V20H34.0661V6.608H38.1701V8.288C38.5861 7.728 39.1301 7.288 39.8021 6.968C40.4741 6.632 41.2341 6.464 42.0821 6.464C43.0901 6.464 43.9861 6.68 44.7701 7.112C45.5701 7.544 46.1941 8.16 46.6421 8.96C47.1061 8.224 47.7381 7.624 48.5381 7.16C49.3381 6.696 50.2101 6.464 51.1541 6.464ZM61.5364 5.216C60.8164 5.216 60.2244 5.008 59.7604 4.592C59.3124 4.16 59.0884 3.632 59.0884 3.008C59.0884 2.368 59.3124 1.84 59.7604 1.424C60.2244 0.991999 60.8164 0.775999 61.5364 0.775999C62.2404 0.775999 62.8164 0.991999 63.2644 1.424C63.7284 1.84 63.9604 2.368 63.9604 3.008C63.9604 3.632 63.7284 4.16 63.2644 4.592C62.8164 5.008 62.2404 5.216 61.5364 5.216ZM63.5764 6.608V20H59.4724V6.608H63.5764ZM74.7105 6.464C76.2785 6.464 77.5265 6.976 78.4545 8C79.3985 9.008 79.8705 10.4 79.8705 12.176V20H75.7905V12.728C75.7905 11.832 75.5585 11.136 75.0945 10.64C74.6305 10.144 74.0065 9.896 73.2225 9.896C72.4385 9.896 71.8145 10.144 71.3505 10.64C70.8865 11.136 70.6545 11.832 70.6545 12.728V20H66.5505V6.608H70.6545V8.384C71.0705 7.792 71.6305 7.328 72.3345 6.992C73.0385 6.64 73.8305 6.464 74.7105 6.464ZM93.8824 8.048C93.8824 9.488 93.4104 10.648 92.4664 11.528C91.5224 12.408 90.1064 12.848 88.2184 12.848H84.8344V20H83.1544V3.224H88.2184C90.0904 3.224 91.4984 3.664 92.4424 4.544C93.4024 5.424 93.8824 6.592 93.8824 8.048ZM88.2184 11.408C90.8424 11.408 92.1544 10.288 92.1544 8.048C92.1544 6.928 91.8424 6.08 91.2184 5.504C90.5944 4.928 89.5944 4.64 88.2184 4.64H84.8344V11.408H88.2184ZM98.3813 9.224C98.7493 8.408 99.3093 7.776 100.061 7.328C100.829 6.88 101.765 6.656 102.869 6.656V8.408H102.413C101.197 8.408 100.221 8.736 99.4853 9.392C98.7493 10.048 98.3813 11.144 98.3813 12.68V20H96.7013V6.896H98.3813V9.224ZM111.133 20.192C109.901 20.192 108.789 19.92 107.797 19.376C106.821 18.816 106.045 18.032 105.469 17.024C104.909 16 104.629 14.808 104.629 13.448C104.629 12.088 104.917 10.904 105.493 9.896C106.069 8.872 106.853 8.088 107.845 7.544C108.837 6.984 109.949 6.704 111.181 6.704C112.413 6.704 113.525 6.984 114.517 7.544C115.525 8.088 116.309 8.872 116.869 9.896C117.445 10.904 117.733 12.088 117.733 13.448C117.733 14.792 117.445 15.976 116.869 17C116.293 18.024 115.501 18.816 114.493 19.376C113.485 19.92 112.365 20.192 111.133 20.192ZM111.133 18.728C111.997 18.728 112.797 18.536 113.533 18.152C114.269 17.752 114.861 17.16 115.309 16.376C115.773 15.576 116.005 14.6 116.005 13.448C116.005 12.296 115.781 11.328 115.333 10.544C114.885 9.744 114.293 9.152 113.557 8.768C112.821 8.368 112.021 8.168 111.157 8.168C110.293 8.168 109.493 8.368 108.757 8.768C108.021 9.152 107.429 9.744 106.981 10.544C106.549 11.328 106.333 12.296 106.333 13.448C106.333 14.6 106.549 15.576 106.981 16.376C107.429 17.16 108.013 17.752 108.733 18.152C109.469 18.536 110.269 18.728 111.133 18.728Z'
		// 		fill='#444444'
		// 	/>
		// </svg>
		<svg
			version='1.1'
			id='Layer_1'
			xmlns='http://www.w3.org/2000/svg'
			x='0px'
			y='0px'
			width='180px'
			height='54px'
			viewBox='0 0 200 54'
			enableBackground='new 0 0 200 54'
			className={className}
			onClick={onClick}
		>
			{' '}
			<image
				id='image0'
				width='200'
				height='54'
				x='0'
				y='0'
				href='data:image/png;base64,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'
			/>
		</svg>
	);
};
export const CommunitySection = () => {
	return (
		<section className="relative">
			<div className="container mx-auto text-white px-5 py-6 2xl:px-0">
				<div className="flex flex-col items-center">
					<div className="p-5 text-center text-bold text-black text-2xl">
						<div>
							<h3 className="mb-12 text-center text-3xl font-semibold text-foreground sm:mb-16 sm:text-4xl">
								Our Community
							</h3>
							<div className="grid gap-10">
								<div className="grid grid-cols-2 md:flex items-center justify-center gap-5 md:gap-15">
									<a
										href="https://t.me/surabayapy"
										target="_blank"
										rel="noreferrer"
									>
										<img
											src="/images/logo/community/logo-surabayapy.png"
											alt="Surabaya.py"
											className="object-cover max-h-25 mx-auto"
										/>
									</a>
									<a
										href="https://t.me/pyjogja"
										target="_blank"
										rel="noreferrer"
									>
										<img
											src="/images/logo/community/logo-pyjogja.png"
											alt="Navicat"
											className="object-cover max-h-30 mx-auto"
										/>
									</a>
									<a
										href="https://t.me/bandungpy"
										target="_blank"
										rel="noreferrer"
									>
										<img
											src="/images/logo/community/logo-bandungpy.png"
											alt="Bandung.py"
											className="object-cover max-h-30 mx-auto"
										/>
									</a>
									<a href="https://t.me/mkspy" target="_blank" rel="noreferrer">
										<img
											src="/images/logo/community/logo-mkspy.png"
											alt="Bandung.py"
											className="object-cover max-h-30 mx-auto"
										/>
									</a>
								</div>
								<div className="grid grid-cols-2 md:flex items-center justify-center gap-5 md:gap-15">
									<a
										href="https://www.instagram.com/pyladiesid/"
										target="_blank"
										rel="noreferrer"
									>
										<img
											src="/images/logo/community/logo-pyladiesid.png"
											alt="PyLadies Indonesia"
											className="object-cover max-h-30 mx-auto"
										/>
									</a>
									<a
										href="https://www.instagram.com/pyladies.yk/"
										target="_blank"
										rel="noreferrer"
									>
										<img
											src="/images/logo/community/logo-pyladiesyk.png"
											alt="PyLadies Yogyakarta"
											className="object-cover max-h-30 mx-auto"
										/>
									</a>
									<a
										href="https://www.instagram.com/pyladies.bdg/"
										target="_blank"
										rel="noreferrer"
									>
										<img
											src="/images/logo/community/logo-pyladiesbdg.png"
											alt="PyLadies Bandung"
											className="object-cover max-h-30 mx-auto"
										/>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

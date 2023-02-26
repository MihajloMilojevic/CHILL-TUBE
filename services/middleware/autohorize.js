
export default function authorize(user, dozvole) {
	for (const dozvola of dozvole) 
		if(user.dozvole.findIndex(d => dozvola === d) < 0)
			return false;
	return true;
}
  
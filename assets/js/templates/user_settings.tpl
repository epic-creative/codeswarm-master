<h1 class="page-title">
  <i class="fa fa-user"></i>
  User settings
</h1>

<div class="content-wrap">
	<form id="user-config">
		<div class="global-form user-config-form">
	    <div class="gf-col">
	      <label>First Name</label>
	      <input type="text" placeholder="John">

	      <label>Last Name</label>
	      <input type="text" placeholder="Doe">

	      <label>Email</label>
	      <input type="text" placeholder="your@email.com">

	      <label>Username</label>
	      <input type="text" placeholder="johndoe">
	    </div>

	    <div class="gf-col">
	      <label>Password</label>
	      <input name="branch" type="password" placeholder="Password">

	      <label>Confirm Password</label>
	      <input type="password" placeholder="Confirm password">
	    </div>
	  </div>

	  <div class="user-config-image">
			<label>Profile image</label>
			<div class="image-contain">
				<a href="#" class="image-edit-trigger btn btn-sml modal-trigger" id="modal-image-upload--trigger">Edit</a>
				<img src="http://www.gravatar.com/avatar/00000000000000000000000000000000?s=120">
			</div>
		</div>

		<div class="gf-actions">
      <button type="submit" class="btn">Save</button>
      <button class="btn btn-sec">Cancel</button>
    </div>

    <div class="modal" id="modal-image-upload">
    	<div class="modal-contain">
    		<div class="modal-title">Upload new image</div>

    		<div class="modal-body">
    			<input type="file">
    		</div>
    	</div>
    </div>
  </form>
</div>
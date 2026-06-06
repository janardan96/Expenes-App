import { profile, setProfile } from '@stores/reducers/userReducers';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { ScreensName } from '../utils/screen';

const KeyboardAvoidingComponent = () => {
  const UserProfile = useSelector(profile);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [name, setName] = useState(UserProfile?.name || '');
  const [email, setEmail] = useState(UserProfile?.email || '');
  const [mobile, setMobile] = useState(UserProfile?.mobile || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    mobile: false,
  });

  // Validation functions
  const validateName = (value: string) => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]*$/.test(value.trim()))
      return 'Name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim()))
      return 'Please enter a valid email address';
    return '';
  };

  const validateMobile = (value: string) => {
    if (!value.trim()) return 'Mobile number is required';
    if (!/^\d+$/.test(value.trim()))
      return 'Mobile number must contain only digits';
    if (value.trim().length !== 10) return 'Mobile number must be 10 digits';
    return '';
  };

  const validateAll = () => {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      mobile: validateMobile(mobile),
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.mobile;
  };

  const handleSubmit = () => {
    // Mark all fields as touched when submitting
    setTouched({
      name: true,
      email: true,
      mobile: true,
    });

    if (validateAll()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: ScreensName?.UserBottomTab }],
          }),
        );

        // Success - navigate or show success message
        console.log('Form submitted successfully:', { name, email, mobile });
        dispatch(setProfile({ email, mobile, name }));
      }, 1200);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });

    // Validate only the blurred field
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(name);
        break;
      case 'email':
        error = validateEmail(email);
        break;
      case 'mobile':
        error = validateMobile(mobile);
        break;
    }
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        if (touched.name) {
          setErrors({ ...errors, name: validateName(value) });
        }
        break;
      case 'email':
        setEmail(value);
        if (touched.email) {
          setErrors({ ...errors, email: validateEmail(value) });
        }
        break;
      case 'mobile':
        // Only allow numbers
        const numericValue = value.replace(/[^0-9]/g, '');
        setMobile(numericValue);
        if (touched.mobile) {
          setErrors({ ...errors, mobile: validateMobile(numericValue) });
        }
        break;
    }
  };

  const isFormValid =
    name.trim() &&
    email.trim() &&
    mobile.trim() &&
    !errors.name &&
    !errors.email &&
    !errors.mobile;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex flex-1 relative">
          <Image
            source={require('@assets/images/BackgroundCard.png')}
            className="w-full max-h-[309px] absolute top-0"
            resizeMode="cover"
          />
          <View
            className="w-11/12 flex-1 left-1/2 rounded-t-3xl h-3/4 bg-white p-7 absolute bottom-0"
            style={[{ transform: [{ translateX: '-50%' }] }]}
          >
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                Get Started
              </Text>
              <Text className="text-sm text-gray-500 mb-6">
                Enter your details to continue
              </Text>

              {/* Name */}
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Full Name</Text>
                <TextInput
                  value={name}
                  onChangeText={value => handleChange('name', value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="John Doe"
                  className={`border rounded-lg px-4 py-3 ${
                    touched.name && errors.name
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                  maxLength={50}
                />
                {touched.name && errors.name ? (
                  <Text className="text-red-500 text-xs mt-1 ml-1">
                    {errors.name}
                  </Text>
                ) : null}
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={value => handleChange('email', value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={`border rounded-lg px-4 py-3 ${
                    touched.email && errors.email
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                  placeholderTextColor="#999"
                  autoComplete="email"
                />
                {touched.email && errors.email ? (
                  <Text className="text-red-500 text-xs mt-1 ml-1">
                    {errors.email}
                  </Text>
                ) : null}
              </View>

              {/* Mobile */}
              <View className="mb-6">
                <Text className="text-sm text-gray-600 mb-2">
                  Mobile Number
                </Text>
                <TextInput
                  value={mobile}
                  onChangeText={value => handleChange('mobile', value)}
                  onBlur={() => handleBlur('mobile')}
                  placeholder="9876543210"
                  keyboardType="phone-pad"
                  maxLength={10}
                  className={`border rounded-lg px-4 py-3 ${
                    touched.mobile && errors.mobile
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                  placeholderTextColor="#999"
                />
                {touched.mobile && errors.mobile ? (
                  <Text className="text-red-500 text-xs mt-1 ml-1">
                    {errors.mobile}
                  </Text>
                ) : null}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.85}
                className="rounded overflow-hidden"
                disabled={!isFormValid || loading}
              >
                <LinearGradient
                  colors={['#63B5AF', '#539E98', '#438883']}
                  locations={[0.3, 0.5, 0.7]}
                  angle={135}
                  style={[
                    styles.submitButton,
                    { opacity: isFormValid ? 1 : 0.6 },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Continue
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Show form errors summary at bottom */}
              {touched.name &&
              touched.email &&
              touched.mobile &&
              (errors.name || errors.email || errors.mobile) ? (
                <View className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                  <Text className="text-red-600 text-sm text-center">
                    Please fix the errors above to continue
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingHorizontal: 0,
  },
  submitButton: {
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  buttonContainer: {
    borderRadius: 9,
  },
  container: {
    flex: 1,
  },
});

export default KeyboardAvoidingComponent;
